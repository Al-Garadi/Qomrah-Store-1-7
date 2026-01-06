import { useSearchBox } from "react-instantsearch-hooks-web"
import { MagnifyingGlassMini } from "@medusajs/icons"

const SearchBox = () => {
    const { query, refine, clear } = useSearchBox()

    return (
        <div className="flex items-center w-full px-4 py-2 bg-ui-bg-field border-b border-ui-border-base gap-x-2">
            <MagnifyingGlassMini />
            <input
                type="search"
                value={query}
                onChange={(event) => refine(event.currentTarget.value)}
                placeholder="Search products..."
                className="w-full bg-transparent outline-none placeholder:text-ui-fg-muted"
                autoFocus
            />
            {query && (
                <button
                    onClick={() => clear()}
                    className="text-ui-fg-muted hover:text-ui-fg-base"
                >
                    Clear
                </button>
            )}
        </div>
    )
}

export default SearchBox
