import { model } from "@medusajs/framework/utils"

export const Review = model.define("review", {
    id: model.id().primaryKey(),
    title: model.text().nullable(),
    content: model.text(),
    rating: model.number(),
    product_id: model.text(),
    customer_id: model.text().nullable(),
    customer_name: model.text().nullable(),
    is_verified_purchase: model.boolean().default(false),
})
