import Brand from "../brands/Brand"
import Product from "../products/Product"

export default function GroupByShipping({ user, data, setSelectedItem }) {
    const editShipping = (item, type) => {
        if (type === "Product") {
            setSelectedItem({
                ...item,
                type
            })
        } else if (type === "Brand") {
            setSelectedItem({
                ...item,
                type
            })
        }
    }
    const deleteShipping = (gids) => {
        const confirm = window.confirm("Are you sure?")
        const override = gids[0].includes("Collection") ? false : true
        if (confirm) {
            fetch("http://localhost:5001/shipping", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gid: gids,
                    email: user.email,
                    override
                })
            })
            .catch(console.log)
        }
    }
    const keys = Object.keys(data.productsMappedById).filter(key => key !== "undefined")
    const brandKeys = Object.keys(data.brandsMappedById).filter(key => key !== "undefined")

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
        {keys.map(key => {
            const product = data.productsMappedById[key].products[0];
            const products = data.productsMappedById[key].products
            return (
            <>
                <div class="products__product products__product--no-border">
                    <div class="products__product__main">
                        <h3 onClick={toggleAccordion} class="products__product__title products__product__title--pointer">{key} - Product ({data.productsMappedById[key].products.length})</h3>
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
                        {product.end_date && (
                            <div class={new Date(product.end_date).getTime() <= (Date.now() + 86400000) ? "brands__end brands__end--soon" : "brands__end"}>
                                {new Date(product.end_date).getTime() + 86400000 <= Date.now() 
                                    ? 
                                        <p class="brands__end--ended">Ended {product.end_date}</p>
                                    :
                                        <p>Ends on: {product.end_date}</p>
                                }
                            </div>
                        )}
                        <div className="products__product__btn-box">
                            <button className="products__product__button products__product__button--edit" onClick={() => editShipping(product, "Product")}>Edit</button>
                            <button className="products__product__button products__product__button--delete" onClick={() => deleteShipping(products.map(p => p.gid))}>Delete</button>
                        </div>
                    </div>
                </div>
                <div class="products__grouped">
                    {products.map(p => <Product user={user} product={p} setSelectedItem={setSelectedItem} />)}
                </div>
            </>
            )
        })}
        {brandKeys.map(key => {
            const brand = data.brandsMappedById[key].brands[0][1];
            const brands = data.brandsMappedById[key].brands;

            return (
            <>
                <div class="products__product products__product--no-border">
                    <div class="products__product__main">
                        <h3 onClick={toggleAccordion} class="products__product__title products__product__title--pointer">{key} - Brand ({data.brandsMappedById[key].brands.length})</h3>
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
                        {brand.end_date && (
                            <div class={new Date(brand.end_date).getTime() <= (Date.now() + 86400000) ? "brands__end brands__end--soon" : "brands__end"}>
                                {new Date(brand.end_date).getTime() + 86400000 <= Date.now() 
                                    ? 
                                        <p class="brands__end--ended">Ended {brand.end_date}</p>
                                    :
                                        <p>Ends on: {brand.end_date}</p>
                                }
                            </div>
                        )}
                        <div className="products__product__btn-box">
                            <button className="products__product__button products__product__button--edit" onClick={() => editShipping(brand, "Brand")}>Edit</button>
                            <button className="products__product__button products__product__button--delete" onClick={() => deleteShipping(brands.map(b => b[1].gid))}>Delete</button>
                        </div>
                    </div>
                </div>
                <div class="products__grouped">
                    {brands.map(b => <Brand brand={b} products={data.products} setSelectedItem={setSelectedItem} />)}
                </div>
            </>
            )
        })}
        </>
    )
}