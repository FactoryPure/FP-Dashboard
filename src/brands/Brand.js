import { useNavigate } from "react-router-dom"

export default function Brand({ brand, user, products, setSelectedItem, setScreen, search, setSearch }) {
    const navigate = useNavigate()
    const relatedProducts = products.filter(p => p.vendor.replaceAll(" ", "-").replaceAll("&", "-").replaceAll("'", "").replaceAll('"', "").replaceAll(".", "").toLowerCase() === brand[1].handle)
    const createShipping = () => {
        setSelectedItem({
            ...brand[1],
            type: "Brand"
        })
    }
    const editShipping = () => {
        setSelectedItem({
            ...brand[1],
            type: "Brand"
        })
    }
    const deleteShipping = () => {
        const confirm = window.confirm("Are you sure?")
        if (confirm) {
            fetch("https://factorypure-server.herokuapp.com/shipping", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gid: brand[1].gid,
                    email: user.email,
                    override: false
                })
            })
            .catch(console.log)
        }
    }    
    const toggleProduct = () => {
        setSearch(brand[0])
        setScreen("products")
    }
    return (
        <div className="brands__product">
            <div className="brands__product__main">
                <h3 className="brands__product__title--pointer" onClick={toggleProduct}>{brand[0]}</h3>
                <span class="brands__product__count">({relatedProducts.length})</span>
                {(brand[1].pdp_line_1 || brand[1].pdp_line_2 || brand[1].cart_line_1 || brand[1].cart_line_2) && (
                    <>
                        <div className="brands__product__preview">
                            <p className="brands__product__preview__title">PDP</p>
                            <div className="brands__product__preview__details">
                                <p>{brand[1].pdp_line_1}</p>
                                <p>{brand[1].pdp_line_2}</p>
                            </div>
                        </div>
                        <div className="brands__product__preview">
                            <p className="brands__product__preview__title">CART</p>
                            <div className="brands__product__preview__details">
                                <p>{brand[1].cart_line_1}</p>
                                <p>{brand[1].cart_line_2}</p>
                            </div>
                        </div>
                    </>
                )}
                {brand[1].end_date && (
                    <div class={new Date(brand[1].end_date).getTime() <= (Date.now() + 86400000) ? "brands__end brands__end--soon" : "brands__end"}>
                    {new Date(brand[1].end_date).getTime() + 86400000 <= Date.now() 
                        ? 
                            <p class="brands__end--ended">Ended {brand[1].end_date}</p>
                        :
                            <p>Ends on: {brand[1].end_date}</p>
                    }
                </div>
                )}
                <div className="brands__product__btn-box">
                    {(brand[1].pdp_line_1 || brand[1].pdp_line_2 || brand[1].cart_line_1 || brand[1].cart_line_2) 
                        ? (
                            <>
                                <button className="brands__product__button brands__product__button--edit" onClick={editShipping}>Edit</button>
                                <button className="brands__product__button brands__product__button--delete" onClick={deleteShipping}>Delete</button>
                            </>
                        )
                        : (
                            <button className="brands__product__button brands__product__button--create" onClick={createShipping}>Create</button>
                        )}
                </div>
            </div>
        </div>
    )
}