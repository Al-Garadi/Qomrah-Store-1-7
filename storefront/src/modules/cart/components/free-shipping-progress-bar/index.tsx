"use client"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type FreeShippingProgressBarProps = {
    cart: HttpTypes.StoreCart
}

const FreeShippingProgressBar = ({ cart }: FreeShippingProgressBarProps) => {
    if (!cart) return null

    // Threshold in smallest unit (e.g., cents/fils). 5000 YER.
    // Assuming configured currency has 2 decimal digits? 
    // If YER has 0 decimals, then 5000. If 2, then 500000.
    // Usually YER in Medusa might be 0 decimal? Need to check.
    // Standard YER is often 2 decimals but implementation varies.
    // Let's assume 5000 "major" units.
    // Cart subtotal is in "minor" units.

    // Safe default: 500000 (assuming 2 decimals).
    // Ideally, fetch this from a config or region setting.
    const threshold = 500000

    const currentTotal = cart.subtotal || 0
    const progress = Math.min((currentTotal / threshold) * 100, 100)
    const remaining = Math.max(threshold - currentTotal, 0)

    return (
        <div className="flex flex-col gap-y-2 py-4 w-full">
            <div className="flex items-center justify-between text-small-regular text-ui-fg-base">
                <span>Free Shipping</span>
                <span>{progress >= 100 ? "Unlocked!" : `${convertToLocale({ amount: remaining, currency_code: cart.region?.currency_code || 'yer' })} left`}</span>
            </div>
            <div className="h-2 w-full bg-ui-bg-base-hover overflow-hidden rounded-full">
                <div className="h-full bg-ui-bg-interactive transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            {progress >= 100 && (
                <span className="text-small-regular text-green-600 font-semibold">
                    You have verified free shipping!
                </span>
            )}
        </div>
    )
}

export default FreeShippingProgressBar
