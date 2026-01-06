import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

import WhatsAppButton from "@modules/common/components/whatsapp-button"

import { WishlistProvider } from "@lib/context/wishlist-context"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-mode="light">
      <head>
        <script defer data-domain="qomarh.store" src="https://plausible.io/js/script.js"></script>
      </head>
      <body>
        <main className="relative">
          <WishlistProvider>
            <WhatsAppButton />
            {children}
          </WishlistProvider>
        </main>
      </body>
    </html>
  )
}
