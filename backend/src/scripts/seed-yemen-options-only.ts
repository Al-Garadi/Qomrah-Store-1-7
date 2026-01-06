
import { ExecArgs } from "@medusajs/framework/types";
import {
    ContainerRegistrationKeys,
    Modules,
} from "@medusajs/framework/utils";
import {
    createShippingOptionsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedYemenOptionsOnly({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
    const regionModuleService = container.resolve(Modules.REGION);

    logger.info("Seeding Yemen Shipping Options Only...");

    // 1. Get Region
    const regions = await regionModuleService.listRegions({ name: "Yemen" }); // Try filter
    // fallback
    const allRegions = await regionModuleService.listRegions();
    const yemenRegion = regions.length ? regions[0] : allRegions.find(r => r.name === "Yemen");

    if (!yemenRegion) {
        throw new Error("Yemen region not found! Cannot seed options.");
    }

    // 2. Get/Create Fulfillment Set & Service Zone
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

    // 3. Shipping Profile
    const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({ type: "default" });
    const shippingProfileId = shippingProfiles[0].id;

    // 4. Create Shipping Options
    // Check existence
    const existingOptions = await fulfillmentModuleService.listShippingOptions({
        service_zone_id: serviceZoneId
    } as any);


    const optionsToCreate: any[] = [];

    const sanaaExists = existingOptions.some(o => o.name.includes("Sana'a"));
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

    const adenExists = existingOptions.some(o => o.name.includes("Aden"));
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
        logger.info("Creating " + optionsToCreate.length + " options...");
        await createShippingOptionsWorkflow(container).run({
            input: optionsToCreate as any,
        });
        logger.info("✅ Yemen Shipping Options Created!");
    } else {
        logger.info("✅ Shipping Options already exist.");
    }
}
