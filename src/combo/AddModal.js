import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function AddModal({ addItem, setAddItem }) {
    const { data, user } = useSelector(state => state)
    const [search, setSearch] = useState("")
    const [filteredProducts, setFilteredProducts] = useState(data.products)
    const [filteredBrands, setFilteredBrands] = useState(data.brands)
    const [selectedGIDs, setSelectedGIDs] = useState({
        gids: [],
        titles: []
    })
    const handleSubmit = () => {
        const body = JSON.stringify({
            gids: selectedGIDs.gids,
            pdp_line_1: addItem.mode === "default" ? addItem.pdp_line_1 : addItem.or_pdp_line_1,
            pdp_line_2: addItem.mode === "default" ? addItem.pdp_line_2 : addItem.or_pdp_line_2,
            cart_line_1: addItem.mode === "default" ? addItem.cart_line_1 : addItem.or_cart_line_1,
            cart_line_2: addItem.mode === "default" ? addItem.cart_line_2 : addItem.or_cart_line_2,
            message_id: addItem.mode === "default" ? addItem.message_id : addItem.or_message_id,
            end_date: addItem.mode === "default" ? addItem.end_date : addItem.or_end_date,
            email: user.email,
            table: addItem.type === "product" ? "skus" : "brands",
            override: addItem.mode === "override"
        })
        fetch("https://webdevclothing.com/shipping", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body
        }).then(res => res.json()).then((res) => {
            console.log(res)
            console.log(JSON.parse(body))
            setSelectedGIDs({
                gids: [],
                titles: []
            })
            setAddItem(null)
        })
    }
    const toggleSelect = (product) => {
        if (product.brandTitle) {
            if (selectedGIDs.gids.includes(product.gid)) {
                setSelectedGIDs({
                    titles: selectedGIDs.titles.filter(t => t !== product.brandTitle),
                    gids: selectedGIDs.gids.filter(g => g !== product.gid)
                })
            } else {
                setSelectedGIDs({
                    titles: [...selectedGIDs.titles, product.brandTitle],
                    gids: [...selectedGIDs.gids, product.gid]
                })
            }
        } else {
            if (selectedGIDs.gids.includes(product.gid)) {
                setSelectedGIDs({
                    titles: selectedGIDs.titles.filter(t => t !== product.title),
                    gids: selectedGIDs.gids.filter(g => g !== product.gid)
                })
            } else {
                setSelectedGIDs({
                    titles: [...selectedGIDs.titles, product.title],
                    gids: [...selectedGIDs.gids, product.gid]
                })
            }
        }
    }
    const handleBulkProducts = () => {

    }
    const handleBulkBrands = () => {

    }
    const [bulk, setBulk] = useState(false)
    let debounce = setTimeout(() => {},1)
    useEffect(() => {
        clearTimeout(debounce)
        debounce = setTimeout(() => {
            const filteredItems = data.products.filter(p => {
                if (p.title.toLowerCase().includes(search.toLowerCase())) return true
                if (p.skus.find(s => s.sku && s.sku.toLowerCase().includes(search.toLowerCase()))) return true
            })
            setFilteredProducts(filteredItems)
        }, 200)
    }, [search])
    return (
        <>
        {addItem && 
            <div class="additional-modal">
                <div class="additional-modal__inner">
                    <div class="modal__close" onClick={() => {
                        setAddItem(false)
                        setSelectedGIDs({
                            gids: [],
                            titles: []
                        })
                    }}>&times;</div>
                    <div class="additional-modal__add-panel">
                    {addItem.type === "product" 
                    ? 
                        <>
                            <div style={{marginTop: "16px"}} class="new-message__form__row new-message__form__row--flex">
                                <p class="new-message__form__row__title">Selected Products</p>
                                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="filter" />
                            </div>
                            <div class="new-message__list">
                                {filteredProducts.map(p => {
                                    const variants = p.skus.length > 1 ? p.skus : null;
                                    return (
                                        <>
                                            <div onClick={() => toggleSelect(p)} class="new-message__list-item">
                                                <div class={selectedGIDs.gids.includes(p.gid) ? "checked checkbox" : "checkbox"}>&nbsp;</div>
                                                <p>{p.title}</p>
                                            </div>
                                            {variants && variants.map(v => {
                                                const item = {
                                                    gid: v.gid,
                                                    title: `${v.sku} - ${p.title} - ${v.title}`
                                                }
                                                return (
                                                    <div onClick={() => toggleSelect(item)} class="new-message__list-item">
                                                        <div class={selectedGIDs.gids.includes(v.gid) ? "checked checkbox" : "checkbox"}>&nbsp;</div>
                                                        <p>{item.title}</p>
                                                    </div>
                                                )
                                            })}
                                        </>
                                    )
                                })}
                            </div>
                            {/* <p onClick={() => setBulk(!bulk)}>{bulk ? "Hide bulk editor" : "Show bulk editor"}</p> */}
                            {bulk && <textarea class="modal__textarea" onChange={handleBulkProducts}></textarea>}
                            <button class="additional-modal__submit" onClick={handleSubmit}>SUBMIT</button>
                        </>
                    :
                        <>
                             <div style={{marginTop: "16px"}} class="new-message__form__row new-message__form__row--flex">
                                <p class="new-message__form__row__title">Selected Brands</p>
                                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="filter" />
                            </div>
                            <div class="new-message__list">
                                {filteredBrands.map(b => {
                                    return (
                                        <>
                                            <div onClick={() => toggleSelect(b)} class="new-message__list-item">
                                                <div class={selectedGIDs.gids.includes(b.gid) ? "checked checkbox" : "checkbox"}>&nbsp;</div>
                                                <p>{b.brandTitle}</p>
                                            </div>
                                        </>
                                    )
                                })}
                            </div>
                            {/* <p onClick={() => setBulk(!bulk)}>{bulk ? "Hide bulk editor" : "Show bulk editor"}</p> */}
                            {bulk && <textarea class="modal__textarea" onChange={handleBulkBrands}></textarea>}
                            <button class="additional-modal__submit" onClick={handleSubmit}>SUBMIT</button>
                        </>
                    }
                    </div>
                    <div class="additional-modal__inner__toAdd">
                        {selectedGIDs.titles.map((t, idx) => {
                            const item = {
                                title: t,
                                gid: selectedGIDs.gids[idx]
                            }
                            return (
                                <p style={{cursor: "pointer"}} onClick={() => toggleSelect(item)}>{t}</p>
                            )
                        })}
                    </div>
                </div>
            </div>
        }
        </>
    )
}