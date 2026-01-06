
import { ExecArgs } from "@medusajs/framework/types";
import {
    ContainerRegistrationKeys,
    Modules,
} from "@medusajs/framework/utils";
import {
    createRegionsWorkflow,
    createShippingOptionsWorkflow,
    createTaxRegionsWorkflow,
    updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedYemenShipping({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

    try {
        const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
        const storeModuleService = container.resolve(Modules.STORE);
        const paymentModuleService = container.resolve(Modules.PAYMENT);
        const regionModuleService = container.resolve(Modules.REGION);

        logger.info("Starting Yemen Shipping & Payment Seeding...");

        // Debug: List Payment Providers
        const providers = await paymentModuleService.listPaymentProviders();
        logger.info("Available Payment Providers: " + JSON.stringify(providers.map(p => p.id)));

        const [store] = await storeModuleService.listStores();

        // 0. Update Store to support YER
        logger.info("Updating Store currencies to include YER...");
        const currentCurrencies = store.supported_currencies || [];
        logger.info("Current Currencies: " + JSON.stringify(currentCurrencies.map(c => ({ code: c.currency_code, default: c.is_default }))));

        const hasYer = currentCurrencies.some(c => c.currency_code === "yer");

        if (!hasYer) {
            logger.info("Adding YER to store currencies via Workflow...");

            // Re-construct the list. Ensure valid object structure.
            let newCurrencies = currentCurrencies.map(c => ({
                currency_code: c.currency_code,
                is_default: c.is_default
            }));

            // Ensure at least one default exists before adding new one
            if (!newCurrencies.some(c => c.is_default)) {
                if (newCurrencies.length > 0) {
                    newCurrencies[0].is_default = true;
                    logger.info("Forcing default currency: " + newCurrencies[0].currency_code);
                }
            }

            newCurrencies.push({ currency_code: "yer", is_default: false });

            // Check again for default. If none (list was empty), make YER default.
            if (!newCurrencies.some(c => c.is_default)) {
                logger.info("No default currency found. Setting YER as default.");
                const yerEntry = newCurrencies.find(c => c.currency_code === "yer");
                if (yerEntry) yerEntry.is_default = true;
            }

            await updateStoresWorkflow(container).run({
                input: {
                    selector: { id: store.id },
                    update: {
                        supported_currencies: newCurrencies
                    }
                }
            });
        }

        // 1. Create/Get Region: Yemen
        logger.info("Checking/Creating Region: Yemen...");
        const allRegions = await regionModuleService.listRegions();
        logger.info("Existing Regions: " + allRegions.map(r => r.name).join(", "));
        const existingRegions = allRegions.filter(r => r.name === "Yemen");
        let yemenRegion;

        if (existingRegions.length) {
            logger.info("Region 'Yemen' already exists. Using existing region.");
            yemenRegion = existingRegions[0];
        } else {
            logger.info("Creating Region: Yemen...");
            const paymentProviders = providers.length > 0 ? [providers[0].id] : ["pp_system_default"];

            const { result: regionResult } = await createRegionsWorkflow(container).run({
                input: {
                    regions: [
                        {
                            name: "Yemen",
                            currency_code: "yer",
                            countries: ["ye"],
                            payment_providers: paymentProviders,
                        },
                    ],
                },
            });
            yemenRegion = regionResult[0];
        }

        // 2. Create Tax Region
        logger.info("Creating Tax Region for Yemen...");
        try {
            await createTaxRegionsWorkflow(container).run({
                input: [{ country_code: "ye" }],
            });
        } catch (e) {
            // Ignore if already exists (might prevent dupes)
            logger.warn("Tax region creation failed (likely exists): " + e.message);
        }

        const fulfillmentSets = await fulfillmentModuleService.listFulfillmentSets({
            name: "Yemen Local Delivery"
        });

        let yemenFulfillmentSet;

        if (fulfillmentSets.length) {
            yemenFulfillmentSet = fulfillmentSets[0];
        } else {
            logger.info("Creating Fulfillment Set: Yemen Local Delivery...");
            yemenFulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
                name: "Yemen Local Delivery",
                type: "shipping",
                service_zones: [
                    {
                        name: "Yemen Cities",
                        geo_zones: [
                            { country_code: "ye", type: "country" }
                        ],
                    },
                ],
            });
        }

        const serviceZoneId = yemenFulfillmentSet.service_zones[0].id;

        // Lookup Shipping Profile
        const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({ type: "default" });
        const shippingProfileId = shippingProfiles[0].id;

        // 4. Create Shipping Options
        logger.info("Creating Shipping Options...");

        const existingOptions = await fulfillmentModuleService.listShippingOptions({
            service_zone_id: serviceZoneId
        } as any);

        const sanaaExists = existingOptions.some(o => o.name.includes("Sana'a"));
        const adenExists = existingOptions.some(o => o.name.includes("Aden"));

        const optionsToCreate: any[] = [];

        if (!sanaaExists) {
            optionsToCreate.push({
                name: "Sana'a Delivery (Cash on Delivery)",
                price_type: "flat",
                provider_id: "manual",
                service_zone_id: serviceZoneId,
                shipping_profile_id: shippingProfileId,
                type: {
                    label: "Sana'a Standard",
                    description: "Delivery within Sana'a city limits (1-2 days).",
                    code: "sanaa-standard",
                },
                prices: [
                    {
                        currency_code: "yer",
                        amount: 1500,
                    },
                    {
                        region_id: yemenRegion.id,
                        amount: 1500,
                    }
                ],
                rules: [],
            });
        }

        if (!adenExists) {
            optionsToCreate.push({
                name: "Aden Delivery (Cash on Delivery)",
                price_type: "flat",
                provider_id: "manual",
                service_zone_id: serviceZoneId,
                shipping_profile_id: shippingProfileId,
                type: {
                    label: "Aden Standard",
                    description: "Delivery within Aden city limits (2-3 days).",
                    code: "aden-standard",
                },
                prices: [
                    {
                        currency_code: "yer",
                        amount: 2500,
                    },
                    {
                        region_id: yemenRegion.id,
                        amount: 2500,
                    }
                ],
                rules: [],
            });
        }

        if (optionsToCreate.length) {
            await createShippingOptionsWorkflow(container).run({
                input: optionsToCreate as any,
            });
            logger.info("Created " + optionsToCreate.length + " shipping options.");
        } else {
            logger.info("Shipping options already exist.");
        }

        logger.info("Yemen Shipping & Payment Configured! 🇾🇪");
    } catch (error) {
        logger.error("Error Seeding Yemen Shipping: " + error.message);
        logger.error(JSON.stringify(error));
        throw error;
    }
}
