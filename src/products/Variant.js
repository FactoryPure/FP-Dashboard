import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
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

export default function Variant({ productTitle, variant }) {
    const { user } = useSelector(state => state)
    const dispatch = useDispatch();

    const createShipping = () => {
        dispatch(setSelected({
            ...variant,
            type: "Product",
            title: `${productTitle} - ${variant.title} - ${variant.sku}`
        }))
    }
    const editShipping = () => {
        dispatch(setSelected({
            ...variant,
            type: "Product",
            title: `${productTitle} - ${variant.title} - ${variant.sku}`
        }))   
    }
    const deleteShipping = () => {
        const confirm = window.confirm("Are you sure?")
        if (confirm) {
            fetch("https://webdevclothing.com/shipping", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gids: [variant.gid],
                    email: user.email,
                    table: "skus",
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
            fetch("https://webdevclothing.com/shipping", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gids: [variant.gid],
                    email: user.email,
                    table: "skus",
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
            fetch("https://webdevclothing.com/shipping", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gids: [variant.gid],
                    email: user.email,
                    table: "skus",
                    override: true,
                    completely: false,
                })
            })
            .catch(console.log)
        }
    }
    return (
        <div className="products__variants__variant">
            <h3>{variant.sku} - {variant.title}</h3>
            {hasDetails(variant) && (
                    <div class="products__product__details">
                        <div class="products__product__details__heading-row">
                            <p class="products__product__details__heading">Default</p>
                            {variant.end_date && (
                                <div class={new Date(variant.end_date).getTime() <= (Date.now() + (86400000 * 4)) ? "brands__end brands__end--soon" : "brands__end"}>
                                    {new Date(variant.end_date).getTime() + 86400000 <= Date.now() 
                                        ? 
                                            <p class="brands__end--ended">Ended {variant.end_date}</p>
                                        :
                                            <p>Ends on: {variant.end_date}</p>
                                    }
                                </div>
                            )}
                            <button class="products__product__button__small--delete" onClick={deleteDefault}>&times;</button>
                        </div>                        
                        <div class="products__product__details__inner">
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
                        </div>
                    </div>
                )}
                {hasOverride(variant) && (
                    <div class="products__product__details">
                        <div class="products__product__details__heading-row">
                            <p class="products__product__details__heading products__product__details__heading--override">Override</p>
                            {variant.or_end_date && (
                                <div class={new Date(variant.or_end_date).getTime() <= (Date.now() + (86400000 * 4)) ? "brands__end brands__end--soon" : "brands__end"}>
                                    {new Date(variant.or_end_date).getTime() + 86400000 <= Date.now() 
                                        ? 
                                            <p class="brands__end--ended">Ended {variant.or_end_date}</p>
                                        :
                                            <p>Ends on: {variant.or_end_date}</p>
                                    }
                                </div>
                            )}
                            <button class="products__product__button__small--delete" onClick={deleteOverride}>&times;</button>
                        </div>
                        <div class="products__product__details__inner">
                            <div className="products__product__preview">
                                <p className="products__product__preview__title">PDP</p>
                                <div className="products__product__preview__details">
                                    <p>{variant.or_pdp_line_1}</p>
                                    <p>{variant.or_pdp_line_2}</p>
                                </div>
                            </div>
                            <div className="products__product__preview">
                                <p className="products__product__preview__title">CART</p>
                                <div className="products__product__preview__details">
                                    <p>{variant.or_cart_line_1}</p>
                                    <p>{variant.or_cart_line_2}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            <div className="products__product__btn-box">
                {(hasDetails(variant) || hasOverride(variant)) 
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