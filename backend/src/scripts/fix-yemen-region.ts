
import { ExecArgs } from "@medusajs/framework/types";
import {
    ContainerRegistrationKeys,
    Modules,
} from "@medusajs/framework/utils";
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows";

export default async function fixYemenRegion({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const regionModuleService = container.resolve(Modules.REGION);
    const paymentModuleService = container.resolve(Modules.PAYMENT);

    logger.info("Fixing Yemen Region Payment Providers...");

    const regions = await regionModuleService.listRegions({ name: "Yemen" }); // Try filter
    // fallback
    const allRegions = await regionModuleService.listRegions();
    const yemenRegion = regions.length ? regions[0] : allRegions.find(r => r.name === "Yemen");

    if (!yemenRegion) {
        throw new Error("Yemen region not found");
    }

    // Get providers
    const providers = await paymentModuleService.listPaymentProviders();
    const providerIds = providers.length > 0 ? providers.map(p => p.id) : ["pp_system_default"];
    logger.info("Using providers: " + providerIds.join(", "));

    await updateRegionsWorkflow(container).run({
        input: {
            selector: { id: yemenRegion.id },
            update: {
                payment_providers: providerIds
            }
        }
    });

    logger.info("✅ Yemen Region Updated with Payment Providers!");
}
