import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setSelected } from "../redux/selected"

const hasDetails = (item) => {
    if (
      item.pdp_line_1 ||
      item.pdp_line_2 ||
      item.cart_line_1 ||
      item.cart_line_2 
    ) {
      return true
    }
    return false
}
const hasOverride = (item) => {
    if (
        item.or_pdp_line_1 ||
        item.or_pdp_line_2 ||
        item.or_cart_line_1 ||
        item.or_cart_line_2
      ) {
        return true
      }
      return false
}

export default function Brand({ brand, products, setSearch }) {
    const { user } = useSelector(state => state)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const relatedProducts = products.filter(p => p.vendor.replaceAll(" ", "-").replaceAll("&", "-").replaceAll("'", "").replaceAll('"', "").replaceAll(".", "").toLowerCase() === brand.handle)
    
    const createShipping = () => {
        dispatch(setSelected({
            ...brand,
            type: "Brand"
        }))
    }
    const editShipping = () => {
        dispatch(setSelected({
            ...brand,
            type: "Brand"
        }))
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
                    gids: [brand.gid],
                    email: user.email,
                    table: "brands",
                    override: true,
                    completely: true,
                })
            })
            .catch(console.log)
        }
    }   
    const deleteDefault = () => {
        const confirm = window.confirm("Are you sure?")
        if (confirm) {
            fetch("https://ec2-54-173-39-172.compute-1.amazonaws.com/shipping", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gids: [brand.gid],
                    email: user.email,
                    table: "brands",
                    override: false,
                    completely: false,
                })
            })
            .catch(console.log)
        }
    }
    const deleteOverride = () => {
        const confirm = window.confirm("Are you sure?")
        if (confirm) {
            fetch("https://ec2-54-173-39-172.compute-1.amazonaws.com/shipping", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gids: [brand.gid],
                    email: user.email,
                    table: "brands",
                    override: true,
                    completely: false,
                })
            })
            .catch(console.log)
        }
    }
    const toggleProduct = () => {
        setSearch(brand.brandTitle)
        navigate("/products")
    }
    return (
        <>
        <div className="products__product">
            <div className="products__product__main">
                <h3 class="brands__product__title--pointer" onClick={toggleProduct}>{brand.brandTitle} ({relatedProducts.length})</h3>
                <div style={{width: "70%"}} className="products__product__btn-box">
                    {hasDetails(brand)
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
                {hasDetails(brand) && (
                    <div class="products__product__details">
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
                            <button class="products__product__button__small--delete" onClick={deleteDefault}>&times;</button>
                        </div>                        
                        <div class="products__product__details__inner">
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
                        </div>
                    </div>
                )}
                {hasOverride(brand) && (
                    <div class="products__product__details">
                        <div class="products__product__details__heading-row">
                            <p class="products__product__details__heading products__product__details__heading--override">Override</p>
                            {brand.or_end_date && (
                                <div class={new Date(brand.or_end_date).getTime() <= (Date.now() + (86400000 * 4)) ? "brands__end brands__end--soon" : "brands__end"}>
                                    {new Date(brand.or_end_date).getTime() + 86400000 <= Date.now() 
                                        ? 
                                            <p class="brands__end--ended">Ended {brand.or_end_date}</p>
                                        :
                                            <p>Ends on: {brand.or_end_date}</p>
                                    }
                                </div>
                            )}
                            <button class="products__product__button__small--delete" onClick={deleteOverride}>&times;</button>
                        </div>
                        <div class="products__product__details__inner">
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
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    )
}