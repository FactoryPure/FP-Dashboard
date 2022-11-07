import { useEffect, useState } from "react"
import "../products/ProductScreen.css"
import GroupByShipping from "./GroupByShipping"
import UnGrouped from "./UnGrouped"

export default function ComboScreen({ user, data, title, items, products, setSelectedItem, search, setSearch, setScreen }) {
    const [visibleItems, setVisibleItems] = useState(50)
    const [filteredItems, setFilteredItems] = useState(items)
    const [grouping, setGrouping] = useState("")
    useEffect(() => {
        const loadmore = document.querySelector(".js-loadmore")
        const loadObserver = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    if (visibleItems < filteredItems.length) {
                        loadmore.style.display = ""
                        setTimeout(() => {
                            setVisibleItems(visibleItems + 50)
                        }, 500)
                    } else {
                        loadmore.style.display = "none"
                    }
                }
            })
        })
        if (loadmore) loadObserver.observe(loadmore)
        return () => loadObserver.disconnect()
    }, [visibleItems, filteredItems, grouping])
    useEffect(() => {
        if (document.querySelector(".js-loadmore")) document.querySelector(".js-loadmore").style.display = ""
        setVisibleItems(50)
        setFilteredItems(items.filter(p => {
            if (p.title) {
                return p.title.toLowerCase().includes(search.toLowerCase())
            } else {
                return p[0].toLowerCase().includes(search.toLowerCase())
            }
        }))
    }, [search, items])
    useEffect(() => {
    }, [grouping])
    const Mag = () => {
        return (
            <svg class="products__mag" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 118.783 118.783">
                <g>
                    <path d="M115.97,101.597L88.661,74.286c4.64-7.387,7.333-16.118,7.333-25.488c0-26.509-21.49-47.996-47.998-47.996   S0,22.289,0,48.798c0,26.51,21.487,47.995,47.996,47.995c10.197,0,19.642-3.188,27.414-8.605l26.984,26.986   c1.875,1.873,4.333,2.806,6.788,2.806c2.458,0,4.913-0.933,6.791-2.806C119.72,111.423,119.72,105.347,115.97,101.597z    M47.996,81.243c-17.917,0-32.443-14.525-32.443-32.443s14.526-32.444,32.443-32.444c17.918,0,32.443,14.526,32.443,32.444   S65.914,81.243,47.996,81.243z"/>
                </g>
            </svg>
        )
    }

    return (
        <div className="products">
            <div className="products__row">
                <h2>{title}</h2>
                {!title.includes("Ending") && <button className="products__new" onClick={() => setScreen("new-product")}>+</button>}
                <div class="products__search-box">
                    <input 
                        class="products__search"
                        type="text" 
                        name="search" 
                        id="search" 
                        placeholder="search"
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Mag />
                </div>
                <select onChange={(e) => setGrouping(e.target.value)}>
                    <option value="">Group By</option>
                    <option value="message_id">Shipping ID</option>
                </select>
            </div>
            {grouping === "message_id" ? 
                <GroupByShipping user={user} data={data} setSelectedItem={setSelectedItem} />
            :
                <UnGrouped user={user} filteredItems={filteredItems} visibleItems={visibleItems} setSelectedItem={setSelectedItem} search={search} setSearch={setSearch} products={products} setScreen={setScreen} />
            }
        </div>
    )
}