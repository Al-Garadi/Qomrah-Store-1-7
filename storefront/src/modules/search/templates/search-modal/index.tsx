"use client"

import { InstantSearch } from "react-instantsearch-hooks-web"
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"
import SearchBox from "@modules/search/components/search-box"
import Hits from "@modules/search/components/hits"
import RefinementList from "@modules/search/components/refinement-list"
import { MagnifyingGlassMini } from "@medusajs/icons"
import { useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"

const searchClient = instantMeiliSearch(
    process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || "http://localhost:7700",
    process.env.NEXT_PUBLIC_SEARCH_API_KEY || "test_key",
    {
        primaryKey: "id",
    }
)

const SearchModal = () => {
    const [isOpen, setIsOpen] = useState(false)

    // Close modal on Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault()
                setIsOpen((prev) => !prev)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-x-2 text-ui-fg-muted hover:text-ui-fg-base transition-colors"
            >
                <MagnifyingGlassMini />
                <span className="hidden sm:block">Search...</span>
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 border rounded bg-ui-bg-subtle text-[10px] font-medium text-ui-fg-muted font-mono">
                    <span className="text-xs">Ctrl</span>K
                </kbd>
            </button>

            <Transition show={isOpen} as={Fragment}>
                <Dialog onClose={() => setIsOpen(false)} className="relative z-[75]">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:p-6 lg:p-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-ui-bg-base shadow-xl transition-all">
                                    <InstantSearch
                                        indexName={process.env.NEXT_PUBLIC_INDEX_NAME || "products"}
                                        searchClient={searchClient}
                                    >
                                        <div className="flex flex-col h-[80vh]">
                                            <div className="flex-none">
                                                <SearchBox />
                                            </div>
                                            <div className="flex flex-1 overflow-hidden">
                                                <div className="hidden md:block w-64 p-4 border-r border-ui-border-base bg-ui-bg-subtle/30 overflow-y-auto">
                                                    <RefinementList attribute="collection_title" />
                                                </div>
                                                <div className="flex-1 overflow-y-auto">
                                                    <Hits />
                                                </div>
                                            </div>
                                        </div>
                                    </InstantSearch>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default SearchModal
