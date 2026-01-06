"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type WishlistItem = {
    id: string
    handle: string
    title: string
    thumbnail: string
    variant_id?: string
}

interface WishlistContextType {
    wishlist: WishlistItem[]
    addToWishlist: (item: WishlistItem) => void
    removeFromWishlist: (id: string) => void
    isInWishlist: (id: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([])

    useEffect(() => {
        const saved = localStorage.getItem("wishlist")
        if (saved) {
            setWishlist(JSON.parse(saved))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }, [wishlist])

    const addToWishlist = (item: WishlistItem) => {
        if (!isInWishlist(item.id)) {
            setWishlist((prev) => [...prev, item])
        }
    }

    const removeFromWishlist = (id: string) => {
        setWishlist((prev) => prev.filter((item) => item.id !== id))
    }

    const isInWishlist = (id: string) => {
        return wishlist.some((item) => item.id === id)
    }

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    )
}

export const useWishlist = () => {
    const context = useContext(WishlistContext)
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider")
    }
    return context
}
