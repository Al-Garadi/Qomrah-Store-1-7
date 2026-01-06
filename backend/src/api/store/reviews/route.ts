
import {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { z } from "zod"

// POST /store/reviews
export const POST = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    const reviewsModuleService: any = req.scope.resolve("reviews")

    // Basic validation schema
    const schema = z.object({
        product_id: z.string(),
        rating: z.number().min(1).max(5),
        content: z.string(),
        title: z.string().optional(),
        customer_name: z.string().optional(),
    })

    // Validate body
    const { success, data, error } = schema.safeParse(req.body)

    if (!success) {
        throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            error.message
        )
    }

    // Create review
    const review = await reviewsModuleService.createReviews({
        ...data,
        customer_id: req.auth_context?.actor_id || null // If authenticated
    })

    res.json({ review })
}

// GET /store/reviews?product_id=...
export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    const reviewsModuleService: any = req.scope.resolve("reviews")
    const { product_id } = req.query

    if (!product_id) {
        throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "product_id is required"
        )
    }

    const reviews = await reviewsModuleService.listReviews({
        product_id: product_id as string
    })

    res.json({ reviews })
}
