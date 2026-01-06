"use client"

import { useEffect, useState } from "react"
import { Heading, Text } from "@medusajs/ui"
import ReviewForm from "./review-form"

type Review = {
    id: string
    customer_name: string
    rating: number
    content: string
    created_at: string
}

const ReviewList = ({ productId }: { productId: string }) => {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/store/reviews?product_id=${productId}`)
                const data = await res.json()
                if (data.reviews) {
                    setReviews(data.reviews)
                }
            } catch (err) {
                console.error("Failed to fetch reviews", err)
            } finally {
                setLoading(false)
            }
        }

        fetchReviews()
    }, [productId])

    return (
        <div className="py-12 border-t border-ui-border-base mt-12 w-full">
            <div className="content-container">
                <Heading level="h2" className="mb-6 text-2xl">Customer Reviews</Heading>

                <div className="grid grid-cols-1 medium:grid-cols-2 gap-12">
                    <div>
                        {loading ? (
                            <Text>Loading reviews...</Text>
                        ) : reviews.length === 0 ? (
                            <Text className="text-ui-fg-muted">No reviews yet. Be the first to review!</Text>
                        ) : (
                            <ul className="flex flex-col gap-y-6">
                                {reviews.map((review) => (
                                    <li key={review.id} className="border-b pb-4 last:border-0 border-ui-border-base">
                                        <div className="flex items-center gap-x-2 mb-2">
                                            <span className="font-semibold text-ui-fg-base">{review.customer_name || "Anonymous"}</span>
                                            <span className="text-yellow-400">{"★".repeat(review.rating)}<span className="text-gray-200">{"★".repeat(5 - review.rating)}</span></span>
                                        </div>
                                        <Text className="text-ui-fg-subtle">{review.content}</Text>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <ReviewForm productId={productId} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewList
