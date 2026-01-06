"use client"

import { Heart } from "@medusajs/icons"
import { useWishlist } from "@lib/context/wishlist-context"
import { clx } from "@medusajs/ui"

type WishlistButtonProps = {
    item: {
        id: string
        handle: string
        title: string
        thumbnail: string
    }
    className?: string
}

const WishlistButton = ({ item, className }: WishlistButtonProps) => {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
    const inWishlist = isInWishlist(item.id)

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation if on a link
        e.stopPropagation()
        if (inWishlist) {
            removeFromWishlist(item.id)
        } else {
            addToWishlist(item)
        }
    }

    return (
        <button
            onClick={toggleWishlist}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className={clx(
                "p-2 rounded-full transition-colors duration-200 hover:bg-ui-bg-subtle",
                inWishlist ? "text-red-500" : "text-ui-fg-muted",
                className
            )}
            data-testid="wishlist-button"
        >
            <Heart fill={inWishlist ? "currentColor" : "none"} />
        </button>
    )
}

export default WishlistButton
