import { useHits } from "react-instantsearch-hooks-web"
import Link from "next/link"
import { Container, Text } from "@medusajs/ui"
import Thumbnail from "@modules/products/components/thumbnail"

const Hits = ({ hitComponent: Hit }: { hitComponent?: any }) => {
    const { hits } = useHits()

    if (hits.length === 0) {
        return (
            <div className="py-4 text-center text-ui-fg-muted">
                No results found.
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 p-4">
            {hits.map((hit: any) => (
                <li key={hit.id} className="list-none">
                    <Link href={`/products/${hit.handle}`}>
                        <div className="group flex flex-col gap-y-2">
                            <div className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle rounded-md">
                                <Thumbnail
                                    thumbnail={hit.thumbnail}
                                    images={hit.images}
                                    size="full"
                                />
                            </div>
                            <div className="flex flex-col justify-between">
                                <Text className="text-ui-fg-base">{hit.title}</Text>
                            </div>
                        </div>
                    </Link>
                </li>
            ))}
        </div>
    )
}

export default Hits
