"use client"

import { useEffect, useState } from "react"

const FlashSaleTimer = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime()
            const dest = new Date(targetDate).getTime()
            const diff = dest - now

            if (diff <= 0) {
                clearInterval(interval)
                return
            }

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000)
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [targetDate])

    return (
        <div className="flex gap-4 items-center justify-center p-4 bg-ui-bg-base border border-ui-border-base rounded-lg shadow-sm">
            <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-ui-fg-base">{timeLeft.days}</span>
                <span className="text-xs text-ui-fg-muted uppercase">Days</span>
            </div>
            <span className="text-2xl font-bold text-ui-fg-base">:</span>
            <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-ui-fg-base">{timeLeft.hours}</span>
                <span className="text-xs text-ui-fg-muted uppercase">Hours</span>
            </div>
            <span className="text-2xl font-bold text-ui-fg-base">:</span>
            <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-ui-fg-base">{timeLeft.minutes}</span>
                <span className="text-xs text-ui-fg-muted uppercase">Mins</span>
            </div>
            <span className="text-2xl font-bold text-ui-fg-base">:</span>
            <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-red-500">{timeLeft.seconds}</span>
                <span className="text-xs text-ui-fg-muted uppercase">Secs</span>
            </div>
        </div>
    )
}

export default FlashSaleTimer
