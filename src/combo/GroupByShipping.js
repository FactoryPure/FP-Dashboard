import { useDispatch, useSelector } from "react-redux"
import Brand from "../brands/Brand"
import Product from "../products/Product"
import { setSelected } from "../redux/selected"

export default function GroupByShipping() {
    const dispatch = useDispatch()
    const { data, user } = useSelector(state => state)
    const editShipping = (item, items, type, mode) => {
        const gids = items.map(i => i.gid)
        if (type === "product") {
            dispatch(setSelected({
                ...item,
                gids,
                type,
                mode
            }))
        } else if (type === "brand") {
            dispatch(setSelected({
                ...item,
                gids,
                type,
                mode
            }))
        }
    }
    const deleteShipping = (gids, table, mode) => {
        const confirm = window.confirm("Are you sure?")
        if (confirm) {
            fetch("https://factorypure-server.herokuapp.com/shipping", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gids,
                    email: user.email,
                    table,
                    override: mode === "override",
                    completely: false,
                })
            })
            .catch(console.log)
        }
    }
    const keys = Object.keys(data.productsDefaultMap).filter(key => key !== "ungrouped")
    const overrideKeys = Object.keys(data.productsOverrideMap).filter(key => key !== "ungrouped")
    const brandKeys = Object.keys(data.brandsDefaultMap).filter(key => key !== "ungrouped")
    const brandOverrideKeys = Object.keys(data.brandsOverrideMap).filter(key => key !== "ungrouped")

    const toggleAccordion = ({ target }) => {
        const acc = target.parentNode.parentNode.nextElementSibling
        if (acc.classList.contains("js-accordion--open")) {
            acc.style.maxHeight = ""
            acc.classList.remove("js-accordion--open")
        } else {
            acc.style.maxHeight = acc.scrollHeight + "px"
            acc.classList.add("js-accordion--open")
        }
    }
    return (
        <>
        {overrideKeys.map(key => {
            const product = data.productsOverrideMap[key]
            const products = data.productsOverrideMap[key].products
            return (
            <>
                <div class="products__product products__product--no-border">
                    <div className="products__product__main">
                        <h3 onClick={toggleAccordion} class="products__product__title products__product__title--pointer">{key} - Product ({data.productsOverrideMap[key].products.length})</h3>
                        <div className="products__product__preview">
                            <p className="products__product__preview__title">PDP</p>
                            <div className="products__product__preview__details">
                                <p>{product.or_pdp_line_1}</p>
                                <p>{product.or_pdp_line_2}</p>
                            </div>
                        </div>
                        <div className="products__product__preview">
                            <p className="products__product__preview__title">CART</p>
                            <div className="products__product__preview__details">
                                <p>{product.or_cart_line_1}</p>
                                <p>{product.or_cart_line_2}</p>
                            </div>
                        </div>
                        <div class="products__product__details__heading-row">
                            <p class="products__product__details__heading products__product__details__heading--override">Override</p>
                            {product.or_end_date && (
                                <div class={new Date(product.or_end_date).getTime() <= (Date.now() + (86400000 * 4)) ? "brands__end brands__end--soon" : "brands__end"}>
                                    {new Date(product.or_end_date).getTime() + 86400000 <= Date.now() 
                                        ? 
                                            <p class="brands__end--ended">- Ended {product.or_end_date}</p>
                                        :
                                            <p>- Ends on: {product.or_end_date}</p>
                                    }
                                </div>
                            )}
                        </div>  
                        <div className="products__product__btn-box">
                            <button className="products__product__button products__product__button--edit" onClick={() => editShipping(product, products, "product", "override")}>Edit</button>
                            <button className="products__product__button products__product__button--delete" onClick={() => deleteShipping(products.map(p => p.gid), "skus", "override")}>Delete</button>
                        </div>
                    </div>
                </div>
                <div class="products__grouped">
                    {products.map(p => <Product product={p} />)}
                </div>
            </>
            )
        })}
        {keys.map(key => {
            const product = data.productsDefaultMap[key];
            const products = data.productsDefaultMap[key].products
            return (
            <>
                <div class="products__product products__product--no-border">
                    <div className="products__product__main">
                        <h3 onClick={toggleAccordion} class="products__product__title products__product__title--pointer">{key} - Product ({data.productsDefaultMap[key].products.length})</h3>
                        <div className="products__product__preview">
                            <p className="products__product__preview__title">PDP</p>
                            <div className="products__product__preview__details">
                                <p>{product.pdp_line_1}</p>
                                <p>{product.pdp_line_2}</p>
                            </div>
                        </div>
                        <div className="products__product__preview">
                            <p className="products__product__preview__title">CART</p>
                            <div className="products__product__preview__details">
                                <p>{product.cart_line_1}</p>
                                <p>{product.cart_line_2}</p>
                            </div>
                        </div>
                        <div class="products__product__details__heading-row">
                            <p class="products__product__details__heading">Default</p>
                            {product.end_date && (
                                <div class={new Date(product.end_date).getTime() <= (Date.now() + (86400000 * 4)) ? "brands__end brands__end--soon" : "brands__end"}>
                                    {new Date(product.end_date).getTime() + 86400000 <= Date.now() 
                                        ? 
                                            <p class="brands__end--ended">Ended {product.end_date}</p>
                                        :
                                            <p>Ends on: {product.end_date}</p>
                                    }
                                </div>
                            )}
                        </div> 
                        <div className="products__product__btn-box">
                            <button className="products__product__button products__product__button--edit" onClick={() => editShipping(product, products, "product", "default")}>Edit</button>
                            <button className="products__product__button products__product__button--delete" onClick={() => deleteShipping(products.map(p => p.gid), "skus", "default")}>Delete</button>
                        </div>
                    </div>
                </div>
                <div class="products__grouped">
                    {products.map(p => <Product product={p} />)}
                </div>
            </>
            )
        })}
        {brandOverrideKeys.map(key => {
            const brand = data.brandsOverrideMap[key];
            const brands = data.brandsOverrideMap[key].brands;

            return (
            <>
                <div class="products__product products__product--no-border">
                    <div class="products__product__main">
                        <h3 onClick={toggleAccordion} class="products__product__title products__product__title--pointer">{key} - Brand ({data.brandsOverrideMap[key].brands.length})</h3>
                        <div className="products__product__preview">
                            <p className="products__product__preview__title">PDP</p>
                            <div className="products__product__preview__details">
                                <p>{brand.or_pdp_line_1}</p>
                                <p>{brand.or_pdp_line_2}</p>
                            </div>
                        </div>
                        <div className="products__product__preview">
                            <p className="products__product__preview__title">CART</p>
                            <div className="products__product__preview__details">
                                <p>{brand.or_cart_line_1}</p>
                                <p>{brand.or_cart_line_2}</p>
                            </div>
                        </div>
                        <div class="products__product__details__heading-row">
                            <p class="products__product__details__heading products__product__details__heading--override">Override</p>
                            {brand.end_date && (
                                <div class={new Date(brand.end_date).getTime() <= (Date.now() + (86400000 * 4)) ? "brands__end brands__end--soon" : "brands__end"}>
                                    {new Date(brand.end_date).getTime() + 86400000 <= Date.now() 
                                        ? 
                                            <p class="brands__end--ended">Ended {brand.end_date}</p>
                                        :
                                            <p>Ends on: {brand.or_end_date}</p>
                                    }
                                </div>
                            )}
                        </div>
                        <div className="products__product__btn-box">
                            <button className="products__product__button products__product__button--edit" onClick={() => editShipping(brand, brands, "brand", "override")}>Edit</button>
                            <button className="products__product__button products__product__button--delete" onClick={() => deleteShipping(brands.map(b => b.gid), "brands", "override")}>Delete</button>
                        </div>
                    </div>
                </div>
                <div class="products__grouped">
                    {brands.map(b => <Brand brand={b} products={data.products} />)}
                </div>
            </>
            )
        })}
        {brandKeys.map(key => {
            const brand = data.brandsDefaultMap[key];
            const brands = data.brandsDefaultMap[key].brands;

            return (
            <>
                <div class="products__product products__product--no-border">
                    <div class="products__product__main">
                        <h3 onClick={toggleAccordion} class="products__product__title products__product__title--pointer">{key} - Brand ({data.brandsDefaultMap[key].brands.length})</h3>
                        <div className="products__product__preview">
                            <p className="products__product__preview__title">PDP</p>
                            <div className="products__product__preview__details">
                                <p>{brand.pdp_line_1}</p>
                                <p>{brand.pdp_line_2}</p>
                            </div>
                        </div>
                        <div className="products__product__preview">
                            <p className="products__product__preview__title">CART</p>
                            <div className="products__product__preview__details">
                                <p>{brand.cart_line_1}</p>
                                <p>{brand.cart_line_2}</p>
                            </div>
                        </div>
                        <div class="products__product__details__heading-row">
                            <p class="products__product__details__heading">Default</p>
                            {brand.end_date && (
                                <div class={new Date(brand.end_date).getTime() <= (Date.now() + (86400000 * 4)) ? "brands__end brands__end--soon" : "brands__end"}>
                                    {new Date(brand.end_date).getTime() + 86400000 <= Date.now() 
                                        ? 
                                            <p class="brands__end--ended">Ended {brand.end_date}</p>
                                        :
                                            <p>Ends on: {brand.end_date}</p>
                                    }
                                </div>
                            )}
                        </div>
                        <div className="products__product__btn-box">
                            <button className="products__product__button products__product__button--edit" onClick={() => editShipping(brand, brands, "brand", "default")}>Edit</button>
                            <button className="products__product__button products__product__button--delete" onClick={() => deleteShipping(brands.map(b => b.gid), "brands", "default")}>Delete</button>
                        </div>
                    </div>
                </div>
                <div class="products__grouped">
                    {brands.map(b => <Brand brand={b} products={data.products} />)}
                </div>
            </>
            )
        })}
        </>
    )
}