"use client"

import { useWishlist } from "@lib/context/wishlist-context"
import { Heading, Text, Container } from "@medusajs/ui"
import Link from "next/link"
import Thumbnail from "@modules/products/components/thumbnail"

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist()
    // Note: We might need region to format prices if we stored them, 
    // but for now we just show title/thumbnail.

    if (wishlist.length === 0) {
        return (
            <div className="content-container py-12 flex flex-col items-center justify-center gap-4 text-center">
                <Heading level="h1" className="text-2xl">Your Wishlist is Empty</Heading>
                <Text className="text-ui-fg-subtle">
                    Save your favorite items here to check them out later.
                </Text>
                <Link href="/" className="text-blue-600 hover:underline">
                    Continue Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="content-container py-12">
            <Heading level="h1" className="text-3xl mb-8">My Wishlist</Heading>
            <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-6">
                {wishlist.map((item) => (
                    <div key={item.id} className="group flex flex-col gap-2 relative">
                        <Link href={`/products/${item.handle}`}>
                            <div className="relative w-full aspect-[29/34] bg-ui-bg-subtle overflow-hidden rounded-md">
                                <Thumbnail thumbnail={item.thumbnail} size="full" />
                            </div>
                            <Text className="mt-2 text-ui-fg-base font-medium">{item.title}</Text>
                        </Link>
                        <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white text-red-500 shadow-sm"
                            aria-label="Remove from wishlist"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
