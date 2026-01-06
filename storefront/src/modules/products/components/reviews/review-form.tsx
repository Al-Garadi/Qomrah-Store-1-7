"use client"

import { useState } from "react"
import { Button, Label, Input, Textarea, Heading } from "@medusajs/ui"
import { Star } from "@medusajs/icons" // Assuming icon exists or use luck-react

const ReviewForm = ({ productId }: { productId: string }) => {
    const [rating, setRating] = useState(5)
    const [content, setContent] = useState("")
    const [name, setName] = useState("Anonymous")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/store/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    product_id: productId,
                    rating,
                    content,
                    customer_name: name
                })
            })

            if (res.ok) {
                setSuccess(true)
                setContent("")
                setRating(5)
            }
        } catch (err) {
            console.error("Failed to submit review", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className="p-4 bg-green-50 rounded-lg text-green-700">
                Thank you for your review! It will be visible shortly.
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 max-w-lg mt-8 border p-6 rounded-lg">
            <Heading level="h3" className="text-xl">Write a Review</Heading>

            <div className="flex flex-col gap-y-2">
                <Label>Rating</Label>
                <div className="flex gap-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className="flex flex-col gap-y-2">
                <Label htmlFor="content">Review</Label>
                <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    required
                    placeholder="Share your thoughts..."
                />
            </div>

            <Button type="submit" isLoading={isSubmitting}>Submit Review</Button>
        </form>
    )
}

export default ReviewForm
