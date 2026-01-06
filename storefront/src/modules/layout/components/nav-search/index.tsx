"use client"

import dynamic from "next/dynamic"

const SearchModal = dynamic(() => import("@modules/search/templates/search-modal"), {
    ssr: false,
})

const NavSearch = () => {
    return <SearchModal />
}

export default NavSearch
