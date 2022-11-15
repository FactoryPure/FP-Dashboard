import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../redux/user";
import { setSelected } from "../redux/selected";

import Variant from "./Variant";
import { useEffect } from "react";
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
export default function Product({ product }) {
    const dispatch = useDispatch()
    const user = useSelector(getUser)

    const createShipping = () => {
        dispatch(setSelected({
            ...product,
            type: "Product"
        }))
    }
    const editShipping = () => {
        dispatch(setSelected({
            ...product,
            type: "Product"
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
                    gids: [product.gid],
                    email: user.email,
                    table: "skus",
                    override: true,
                    completely: true,
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
            if (accordion.parentNode.parentNode.classList.contains("js-accordion--open")) accordion.parentNode.parentNode.style.maxHeight = accordion.parentNode.parentNode.scrollHeight + accordion.scrollHeight + "px"
            accordion.style.maxHeight = accordion.scrollHeight + "px"
            accordion.classList.add("js-accordion--open")
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
                    gids: [product.gid],
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
                    gids: [product.gid],
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
        <div className="products__product">
            <div className="products__product__main">
                {(product.skus && product.skus.length > 1) && <span className="products__variant-identifier">+</span>}
                <h3 
                    className={
                        product.skus && product.skus.length > 1 
                            ? 'products__product__title--pointer'
                            : ''
                    }
                    onClick={
                        product.skus && product.skus.length > 1 
                            ? toggleAccordion
                            : null
                    }
                >{product.title}</h3>
                {hasDetails(product) && (
                    <div class="products__product__details">
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
                            <button class="products__product__button__small--delete" onClick={deleteDefault}>&times;</button>
                        </div>                        
                        <div class="products__product__details__inner">
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
                        </div>
                    </div>
                )}
                {hasOverride(product) && (
                    <div class="products__product__details">
                        <div class="products__product__details__heading-row">
                            <p class="products__product__details__heading products__product__details__heading--override">Override</p>
                            {product.or_end_date && (
                                <div class={new Date(product.or_end_date).getTime() <= (Date.now() + (86400000 * 4)) ? "brands__end brands__end--soon" : "brands__end"}>
                                    {new Date(product.or_end_date).getTime() + 86400000 <= Date.now() 
                                        ? 
                                            <p class="brands__end--ended">Ended {product.or_end_date}</p>
                                        :
                                            <p>Ends on: {product.or_end_date}</p>
                                    }
                                </div>
                            )}
                            <button class="products__product__button__small--delete" onClick={deleteOverride}>&times;</button>
                        </div>
                        <div class="products__product__details__inner">
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
                        </div>
                    </div>
                )}
                <div className="products__product__btn-box">
                    {hasDetails(product) || hasOverride(product)
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
            {(product.skus && product.skus.length > 1) && (
                <div className="products__variants">
                    {product.skus.map((v, index) => <Variant productTitle={product.title} variant={v} key={v.sku + "-" + index} />)}
                </div>
            )}
        </div>
    )
}