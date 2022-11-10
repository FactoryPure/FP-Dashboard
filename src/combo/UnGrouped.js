import Brand from "../brands/Brand";
import Product from "../products/Product";

export default function UnGrouped({user, filteredItems, visibleItems, search, setSearch, setSelectedItem, products, setScreen}) {
    return (
        <div className="products__main">
            {filteredItems.slice(0, visibleItems).map((i, index) => i.gid.toLowerCase().includes("product") ? <Product product={i} key={i.title + "-" + index} /> : <Brand brand={i} products={products} key={i.title + "-" + index} setScreen={setScreen} search={search} setSearch={setSearch} /> )}
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
    )
}