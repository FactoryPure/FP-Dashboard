import Variant from "./Variant";

export default function Product({ user, product, setSelectedItem }) {
    const createShipping = () => {
        setSelectedItem({
            ...product,
            type: "Product"
        })
    }
    const editShipping = () => {
        setSelectedItem({
            ...product,
            type: "Product"
        })
    }
    const deleteShipping = () => {
        const confirm = window.confirm("Are you sure?")
        if (confirm) {
            fetch("http://localhost:5001/shipping", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gid: product.gid,
                    email: user.email,
                    override: true
                })
            })
            .catch(console.log)
        }
    }
    const toggleAccordion = ({ target }) => {
        const accordion = target.parentNode.nextElementSibling
        if (accordion.classList.contains("js-accordion--open")) {
            accordion.style.maxHeight = ""
            accordion.classList.remove("js-accordion--open")
        } else {
            accordion.style.maxHeight = accordion.scrollHeight + "px"
            accordion.classList.add("js-accordion--open")
        }
    }
    return (
        <div className="products__product">
            <div className="products__product__main">
                {product.skus.length > 1 && <span className="products__variant-identifier">+</span>}
                <h3 
                    className={
                        product.skus.length > 1 
                            ? 'products__product__title--pointer'
                            : ''
                    }
                    onClick={
                        product.skus.length > 1 
                            ? toggleAccordion
                            : null
                    }
                >{product.title}</h3>
                {(product.pdp_line_1 || product.pdp_line_2 || product.cart_line_1 || product.cart_line_2) && (
                    <>
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
                    </>
                )}
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
                    {(product.pdp_line_1 || product.pdp_line_2 || product.cart_line_1 || product.cart_line_2) 
                        ? (
                            <>
                                <button className="products__product__button products__product__button--edit" onClick={editShipping}>Edit</button>
                                <button className="products__product__button products__product__button--delete" onClick={deleteShipping}>Delete</button>
                            </>
                        )
                        : (
                            <button className="products__product__button products__product__button--create" onClick={createShipping}>Create</button>
                        )}
                </div>
            </div>
            {product.skus.length > 1 && (
                <div className="products__variants">
                    {product.skus.map((v, index) => <Variant productTitle={product.title} variant={v} setSelectedItem={setSelectedItem} key={v.sku + "-" + index} />)}
                </div>
            )}
        </div>
    )
}