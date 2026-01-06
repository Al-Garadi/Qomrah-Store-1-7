
import { ExecArgs } from "@medusajs/framework/types";
import {
    ContainerRegistrationKeys,
    Modules,
} from "@medusajs/framework/utils";

export default async function checkYemen({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const regionModuleService = container.resolve(Modules.REGION);
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

    logger.info("Checking Yemen Configuration...");

    const regions = await regionModuleService.listRegions();
    const yemen = regions.find(r => r.name === "Yemen");

    if (yemen) {
        logger.info("✅ Yemen Region Found!");
        logger.info("Currency: " + yemen.currency_code);
        logger.info("Payment Providers: " + JSON.stringify(yemen.payment_providers));

        // Check shipping options
        // We need service zone id first? Or just list all options and search?
        // listShippingOptions doesn't allow empty filter in v2 sometimes?
        // Let's try listing all.
        try {
            const options = await fulfillmentModuleService.listShippingOptions();
            const yemenOptions = options.filter(o => o.name.includes("Sana'a") || o.name.includes("Aden"));

            if (yemenOptions.length > 0) {
                logger.info("✅ Shipping Options Found: " + yemenOptions.map(o => o.name).join(", "));
            } else {
                logger.warn("❌ No Yemen Shipping Options found.");
            }
        } catch (e) {
            logger.warn("Could not list shipping options: " + e.message);
        }

    } else {
        logger.error("❌ Yemen Region NOT Found.");
    }
}
