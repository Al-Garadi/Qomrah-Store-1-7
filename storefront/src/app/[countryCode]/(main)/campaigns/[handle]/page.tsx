import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { Text, Heading } from "@medusajs/ui"
import ExtendedProductPreview from "@modules/products/components/product-preview" // Assuming we use standard preview
import PaginatedProducts from "@modules/store/templates/paginated-products"
import FlashSaleTimer from "@modules/home/components/flash-sale-timer"

type Props = {
    params: Promise<{ countryCode: string; handle: string }>
    searchParams: Promise<{
        page?: string
        sortBy?: string
    }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params
    const collection = await getCollectionByHandle(params.handle)

    if (!collection) {
        notFound()
    }

    return {
        title: `${collection.title} | Medusa Store`,
        description: `${collection.title} campaign.`,
    }
}

export default async function CampaignPage(props: Props) {
    const params = await props.params
    const searchParams = await props.searchParams

    const { sortBy, page } = searchParams

    const collection = await getCollectionByHandle(params.handle)
    const region = await getRegion(params.countryCode)

    if (!collection || !region) {
        notFound()
    }

    const pageNumber = page ? parseInt(page) : 1

    // Calculate target date for Flash Sale if handle matches
    // Hardcoded example for demo: 2 days from now
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 2)

    return (
        <div className="py-12 content-container">
            <div className="flex flex-col gap-y-8 mb-8 text-center items-center">
                <Heading level="h1" className="text-3xl small:text-4xl text-ui-fg-base mb-4">
                    {collection.title}
                </Heading>
                {params.handle === 'flash-deals' && (
                    <div className="mb-6">
                        <Text className="mb-2 text-ui-fg-subtle">Ends In:</Text>
                        <FlashSaleTimer targetDate={targetDate.toISOString()} />
                    </div>
                )}
                <Text className="text-ui-fg-subtle max-w-2xl mx-auto">
                    Limited time offers on our exclusive collection. Shop now before it's too late!
                </Text>
            </div>

            <PaginatedProducts
                sortBy={(sortBy as any) || "created_at"}
                page={pageNumber}
                collectionId={collection.id}
                countryCode={params.countryCode}
            />
        </div>
    )
}
