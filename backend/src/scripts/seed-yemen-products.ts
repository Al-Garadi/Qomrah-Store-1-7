
import { ExecArgs } from "@medusajs/framework/types";
import {
    ContainerRegistrationKeys,
    Modules,
    ProductStatus,
} from "@medusajs/framework/utils";
import {
    createProductCategoriesWorkflow,
    createProductsWorkflow,
    createCollectionsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedYemenProducts({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);

    logger.info("Starting Yemen Product Seeding...");

    // 1. Get Default Sales Channel
    const salesChannels = await salesChannelModuleService.listSalesChannels({
        name: "Default Sales Channel",
    });

    if (!salesChannels.length) {
        logger.error("Default Sales Channel not found. Please run basic seed first.");
        return;
    }
    const defaultSalesChannelId = salesChannels[0].id;

    // 2. Create Collections
    logger.info("Creating Collections...");
    const { result: collections } = await createCollectionsWorkflow(container).run({
        input: {
            collections: [
                { title: "New Arrivals", handle: "new-arrivals" },
                { title: "Trending", handle: "trending" },
                { title: "Best Sellers", handle: "best-sellers" },
                { title: "Flash Deals", handle: "flash-deals" },
            ]
        }
    });

    const newArrivalsId = collections.find(c => c.handle === "new-arrivals")?.id;
    const trendingId = collections.find(c => c.handle === "trending")?.id;

    // 3. Create Categories
    logger.info("Creating Categories...");
    const { result: categories } = await createProductCategoriesWorkflow(container).run({
        input: {
            product_categories: [
                { name: "Clothes", handle: "clothes", is_active: true },
                { name: "Cosmetics", handle: "cosmetics", is_active: true },
                { name: "Electronics", handle: "electronics", is_active: true },
            ],
        },
    });

    const clothesCat = categories.find(c => c.handle === "clothes")?.id;
    const cosmeticsCat = categories.find(c => c.handle === "cosmetics")?.id;
    const electronicsCat = categories.find(c => c.handle === "electronics")?.id;

    // 4. Create Products
    logger.info("Creating Products...");

    await createProductsWorkflow(container).run({
        input: {
            products: [
                // --- CLOTHES ---
                {
                    title: "Yemeni Ma'awoz (Traditional Pattern)",
                    description: "Authentic handmade Yemeni Ma'awoz with premium cotton fabric.",
                    handle: "yemeni-maawoz-traditional",
                    status: ProductStatus.PUBLISHED,
                    category_ids: [clothesCat!],
                    collection_id: newArrivalsId,
                    options: [
                        { title: "Color", values: ["Blue/White", "Green/Gold", "Red/Black"] },
                    ],
                    variants: [
                        {
                            title: "Blue/White",
                            sku: "MAAWOZ-BW",
                            prices: [{ currency_code: "usd", amount: 25 }, { currency_code: "eur", amount: 23 }],
                            options: { Color: "Blue/White" },
                        },
                        {
                            title: "Green/Gold",
                            sku: "MAAWOZ-GG",
                            prices: [{ currency_code: "usd", amount: 30 }, { currency_code: "eur", amount: 28 }],
                            options: { Color: "Green/Gold" },
                        },
                    ],
                    sales_channels: [{ id: defaultSalesChannelId }],
                    images: [{ url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png" }] // Placeholder
                },
                {
                    title: "Luxury Abaya Black",
                    description: "Elegant black Abaya with embroidery.",
                    handle: "abaya-black-luxury",
                    status: ProductStatus.PUBLISHED,
                    category_ids: [clothesCat!],
                    collection_id: trendingId,
                    options: [
                        { title: "Size", values: ["52", "54", "56", "58"] }
                    ],
                    variants: [
                        { title: "52", sku: "ABAYA-52", prices: [{ currency_code: "usd", amount: 45 }], options: { Size: "52" } },
                        { title: "54", sku: "ABAYA-54", prices: [{ currency_code: "usd", amount: 45 }], options: { Size: "54" } },
                    ],
                    sales_channels: [{ id: defaultSalesChannelId }],
                    images: [{ url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png" }] // Placeholder
                },

                // --- COSMETICS (Metadata: ingredients, volume, expiry) ---
                {
                    title: "Bakhoor Adeni Premium",
                    description: "Traditional incense from Aden, handmade.",
                    handle: "bakhoor-adeni",
                    status: ProductStatus.PUBLISHED,
                    category_ids: [cosmeticsCat!],
                    metadata: {
                        ingredients: "Oud, Musk, Amber, Rose Oil",
                        volume: "50g",
                        expiry: "No Expiry",
                        origin: "Aden, Yemen"
                    },
                    options: [{ title: "Type", values: ["Jar"] }],
                    variants: [
                        { title: "Standard Jar", sku: "BAKHOOR-ADEN", prices: [{ currency_code: "usd", amount: 15 }], options: { Type: "Jar" } }
                    ],
                    sales_channels: [{ id: defaultSalesChannelId }],
                    images: [{ url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/coffee-mug.png" }] // Placeholder
                },
                {
                    title: "Sunscreen SPF 50+",
                    description: "High protection sunscreen.",
                    handle: "sunscreen-spf50",
                    status: ProductStatus.PUBLISHED,
                    category_ids: [cosmeticsCat!],
                    metadata: {
                        volume: "100ml",
                        expiry: "2026-12-01",
                        ingredients: "Zinc Oxide, Vitamin E"
                    },
                    options: [{ title: "Volume", values: ["100ml"] }],
                    variants: [
                        { title: "100ml", sku: "SUNSCREEN-100", prices: [{ currency_code: "usd", amount: 12 }], options: { Volume: "100ml" } }
                    ],
                    sales_channels: [{ id: defaultSalesChannelId }],
                    images: [{ url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/soap.png" }] // Placeholder
                },

                // --- ELECTRONICS (Metadata: specs, warranty) ---
                {
                    title: "Solar Panel 150W",
                    description: "Monocrystalline solar panel, high efficiency.",
                    handle: "solar-panel-150w",
                    status: ProductStatus.PUBLISHED,
                    category_ids: [electronicsCat!],
                    metadata: {
                        specs: {
                            voltage: "12V",
                            wattage: "150W",
                            dimensions: "120x60cm",
                            type: "Monocrystalline"
                        },
                        warranty: "5 Years Manufacturer Warranty"
                    },
                    options: [{ title: "Unit", values: ["Panel"] }],
                    variants: [
                        { title: "Single Panel", sku: "SOLAR-150", prices: [{ currency_code: "usd", amount: 80 }], options: { Unit: "Panel" } }
                    ],
                    sales_channels: [{ id: defaultSalesChannelId }],
                    images: [{ url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png" }] // Placeholder
                },
                {
                    title: "Samsung Galaxy A54 5G",
                    description: "Reliable smartphone with long battery life.",
                    handle: "samsung-a54",
                    status: ProductStatus.PUBLISHED,
                    category_ids: [electronicsCat!],
                    collection_id: trendingId,
                    metadata: {
                        specs: {
                            screen: "6.4 inch AMOLED",
                            processor: "Exynos 1380",
                            battery: "5000mAh",
                            camera: "50MP Main"
                        },
                        warranty: "1 Year Official Agent"
                    },
                    options: [{ title: "Storage/Color", values: ["128GB Black", "256GB Black", "128GB White"] }],
                    variants: [
                        { title: "128GB Black", sku: "SAM-A54-128-BLK", prices: [{ currency_code: "usd", amount: 300 }], options: { "Storage/Color": "128GB Black" } },
                        { title: "256GB Black", sku: "SAM-A54-256-BLK", prices: [{ currency_code: "usd", amount: 350 }], options: { "Storage/Color": "256GB Black" } },
                    ],
                    sales_channels: [{ id: defaultSalesChannelId }],
                    images: [{ url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sunglasses.png" }] // Placeholder
                },
            ],
        },
    });

    logger.info("Yemen Product Seeding Completed Successfully! 🇾🇪");
}
