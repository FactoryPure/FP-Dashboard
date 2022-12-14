import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Product from "./Product"

import "./ProductScreen.css"

export default function ProductScreen({ user, products, setSelectedItem, search, setSearch, setScreen }) {
    const navigate = useNavigate()
    const [visibleProducts, setVisibleProducts] = useState(50)
    const [filteredProducts, setFilteredProducts] = useState(products)
    const [showSku, setShowSku] = useState(false)
    useEffect(() => {
        const loadmore = document.querySelector(".js-loadmore")
        const loadObserver = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    if (visibleProducts < filteredProducts.length) {
                        loadmore.style.display = ""
                        setTimeout(() => {
                            setVisibleProducts(visibleProducts + 50)
                        }, 500)
                    } else {
                        loadmore.style.display = "none"
                    }
                }
            })
        })
        if (loadmore) loadObserver.observe(loadmore)
        return () => loadObserver.disconnect()
    }, [visibleProducts, filteredProducts])
    useEffect(() => {
        if (document.querySelector(".js-loadmore")) document.querySelector(".js-loadmore").style.display = ""
        setVisibleProducts(50)
        setFilteredProducts(products.filter(p => {
            if (p.title.toLowerCase().includes(search.toLowerCase())) return true
            if (p.skus.find(s => s.sku && s.sku.toLowerCase().includes(search.toLowerCase()))) return true
        }))
    }, [search, products])
    const Mag = () => {
        return (
            <svg class="products__mag" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 118.783 118.783">
                <g>
                    <path d="M115.97,101.597L88.661,74.286c4.64-7.387,7.333-16.118,7.333-25.488c0-26.509-21.49-47.996-47.998-47.996   S0,22.289,0,48.798c0,26.51,21.487,47.995,47.996,47.995c10.197,0,19.642-3.188,27.414-8.605l26.984,26.986   c1.875,1.873,4.333,2.806,6.788,2.806c2.458,0,4.913-0.933,6.791-2.806C119.72,111.423,119.72,105.347,115.97,101.597z    M47.996,81.243c-17.917,0-32.443-14.525-32.443-32.443s14.526-32.444,32.443-32.444c17.918,0,32.443,14.526,32.443,32.444   S65.914,81.243,47.996,81.243z"/>
                </g>
            </svg>
        )
    }
    const resetAllProducts = ({ target }) => {
        const confirm = window.confirm("Are you sure? This can take an hour or longer to complete.")
        if (confirm) {
            fetch("https://webdevclothing.com/sync/refreshproducts").then(() => {
                target.remove()
            }).catch(() => {
                target.innerText = "Something went wrong"
            })
        }
    }
    return (
        <div className="products">
            <div className="products__row">
                <h2>Products</h2>
                <button className="products__new" onClick={() => () => {
                    setScreen("new-product")
                    navigate("/new")
                }}>+</button>
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
                <div class="products__showsku">
                    <input type="checkbox" onChange={(e) => setShowSku(e.target.checked)} />
                    <label>Show Sku Instead Of Title</label>
                </div>
                <button class="products__product__button products__product__button--delete" onClick={resetAllProducts}>Refresh Products</button>
            </div>
            <div className="products__main">
                {filteredProducts.slice(0, visibleProducts).map((p, index) => <Product user={user} product={p} key={p.title + "-" + index} setSelectedItem={setSelectedItem} showSku={showSku} />)}
                <div class="js-loadmore loading">
                    <svg version="1.1" id="L3" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        viewBox="0 0 100 100" enableBackground="new 0 0 0 0">
                        <circle fill="none" stroke="black" strokeWidth="4" cx="50" cy="50" r="44" style={{opacity:0.5}}/>
                        <circle fill="black" stroke="black" strokeWidth="3" cx="8" cy="54" r="6" >
                            <animateTransform
                                attributeName="transform"
                                dur="2s"
                                type="rotate"
                                from="0 50 48"
                                to="360 50 52"
                                repeatCount="indefinite" 
                            />
                        </circle>
                    </svg>
                </div>
            </div>
        </div>
    )
}