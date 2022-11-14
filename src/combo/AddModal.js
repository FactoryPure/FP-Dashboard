import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function AddModal({ addItem, setAddItem }) {
    const { data } = useSelector(state => state)
    const [search, setSearch] = useState("")
    const [filteredProducts, setFilteredProducts] = useState(data.products)
    const [selectedGIDs, setSelectedGIDs] = useState({
        gids: [],
        titles: []
    })
    const toggleSelect = () => {

    }
    const handleBulkProducts = () => {

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
                    <div class="modal__close" onClick={() => setAddItem(false)}>&times;</div>
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
                        <p onClick={() => setBulk(!bulk)}>{bulk ? "Hide bulk editor" : "Show bulk editor"}</p>
                        {bulk && <textarea class="modal__textarea" onChange={handleBulkProducts}></textarea>}
                    </>
                :
                    <>
                        {/* <div style={{ marginTop: "16px" }} class="new-message__form__row new-message__form__row--flex">
                            <p class="new-message__form__row__title">Selected Brands</p>
                            <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="filter" />
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
                        <p onClick={() => setBulk(!bulk)}>{bulk ? "Hide bulk editor" : "Show bulk editor"}</p>
                        {bulk && <textarea class="modal__textarea" onChange={handleBulkBrands}></textarea>}                     */}
                    </>
                }
                    {addItem.products.map(p => <p>{p.title}</p>)}
                </div>
            </div>
        }
        </>
    )
}