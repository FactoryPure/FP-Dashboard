import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Brand from "./Brand"
import "./BrandScreen.css"

export default function BrandScreen({ user, brands, products, setSelectedItem, setScreen, search, setSearch }) {
    const navigate = useNavigate()
    const [visibleBrands, setVisibleBrands] = useState(50)
    const [filteredBrands, setFilteredBrands] = useState(brands)
    useEffect(() => {
        const loadmore = document.querySelector(".js-loadmore")
        const loadObserver = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    if (visibleBrands < filteredBrands.length) {
                        loadmore.style.display = ""
                        setTimeout(() => {
                            setVisibleBrands(visibleBrands + 50)
                        }, 500)
                    } else {
                        loadmore.style.display = "none"
                    }
                }
            })
        })
        if (loadmore) loadObserver.observe(loadmore)
        return () => loadObserver.disconnect()
    }, [visibleBrands, filteredBrands])
    useEffect(() => {
        if (document.querySelector(".js-loadmore")) document.querySelector(".js-loadmore").style.display = ""
        setVisibleBrands(50)
        setFilteredBrands(brands.filter(b => b[0].toLowerCase().includes(search.toLowerCase())))
    }, [search])
    const Mag = () => {
        return (
            <svg class="brands__mag" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 118.783 118.783">
                <g>
                    <path d="M115.97,101.597L88.661,74.286c4.64-7.387,7.333-16.118,7.333-25.488c0-26.509-21.49-47.996-47.998-47.996   S0,22.289,0,48.798c0,26.51,21.487,47.995,47.996,47.995c10.197,0,19.642-3.188,27.414-8.605l26.984,26.986   c1.875,1.873,4.333,2.806,6.788,2.806c2.458,0,4.913-0.933,6.791-2.806C119.72,111.423,119.72,105.347,115.97,101.597z    M47.996,81.243c-17.917,0-32.443-14.525-32.443-32.443s14.526-32.444,32.443-32.444c17.918,0,32.443,14.526,32.443,32.444   S65.914,81.243,47.996,81.243z"/>
                </g>
            </svg>
        )
    }
    return (
        <div class="brands">
            <div className="brands__row">
                <h2>Brands</h2>
                <button className="brands__new" onClick={() => {
                    setScreen("new-brand")
                    navigate("/new")
                }}>+</button>
                <div class="brands__search-box">
                    <input 
                        class="brands__search"
                        type="text" 
                        name="search" 
                        id="search" 
                        placeholder="search"
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Mag />
                </div>
            </div>
            <div className="products__main">
                {filteredBrands.slice(0, visibleBrands).map((b, index) => <Brand user={user} brand={b} products={products} key={b.title + "-" + index} setSelectedItem={setSelectedItem} setScreen={setScreen} search={search} setSearch={setSearch} />)}
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