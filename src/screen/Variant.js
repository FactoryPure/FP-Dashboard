export default function Variant({ user, productTitle, variant, setSelectedItem }) {
    const createShipping = () => {
        setSelectedItem({
            ...variant,
            type: "Product",
            title: `${productTitle} - ${variant.title} - ${variant.sku}`
        })
    }
    const editShipping = () => {
        setSelectedItem({
            ...variant,
            type: "Product",
            title: `${productTitle} - ${variant.title} - ${variant.sku}`
        })    
    }
    const deleteShipping = () => {
        const confirm = window.confirm("Are you sure?")
        if (confirm) {
            fetch("https://ec2-54-173-39-172.compute-1.amazonaws.com/shipping", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gid: variant.gid,
                    email: user.email,
                    override: true
                })
            })
            .catch(console.log)
        }
    }
    return (
        <div className="products__variants__variant">
            <h3>{variant.sku} - {variant.title}</h3>
            {(variant.pdp_line_1 || variant.pdp_line_2 || variant.cart_line_1 || variant.cart_line_2) && (
                <>
                    <div className="products__product__preview">
                        <p className="products__product__preview__title">PDP</p>
                        <div className="products__product__preview__details">
                            <p>{variant.pdp_line_1}</p>
                            <p>{variant.pdp_line_2}</p>
                        </div>
                    </div>
                    <div className="products__product__preview">
                        <p className="products__product__preview__title">CART</p>
                        <div className="products__product__preview__details">
                            <p>{variant.cart_line_1}</p>
                            <p>{variant.cart_line_2}</p>
                        </div>
                    </div>
                </>
            )}
            <div className="products__product__btn-box">
                {(variant.pdp_line_1 || variant.pdp_line_2 || variant.cart_line_1 || variant.cart_line_2) 
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
    )
}