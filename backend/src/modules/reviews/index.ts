import { Module } from "@medusajs/framework/utils"
import { ReviewService } from "./services/review"

export const REVIEWS_MODULE = "reviews"

export default Module(REVIEWS_MODULE, {
    service: ReviewService,
})
