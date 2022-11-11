import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./NewMessageScreen.css"

export default function NewMessageScreen({ user, type, products, brands }) {
    const navigate = useNavigate()
    const [mode, setMode] = useState(type ? type : "product")
    const [override, setOverride] = useState(false)
    const [bulk, setBulk] = useState(false)
    const [formData, setFormData] = useState({
        gids: [],
        pdp_line_1: "",
        pdp_line_2: "",
        cart_line_1: "",
        cart_line_2: "",
        message_id: String(Math.floor(Date.now())),
        end_date: null
    })
    const [selectedGIDs, setSelectedGIDs] = useState({
        gids: [],
        titles: []
    })
    const [search, setSearch] = useState("")
    const [filteredProducts, setFilteredProducts] = useState(products)
    const [filteredBrands, setFilteredBrands] = useState(brands)

    const toggleSelect = (product) => {
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
    const handleSubmit = (e) => {
        e.preventDefault()
        fetch("http://localhost:5001/shipping", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gids: selectedGIDs.gids,
                pdp_line_1: formData.pdp_line_1,
                pdp_line_2: formData.pdp_line_2,
                cart_line_1: formData.cart_line_1,
                cart_line_2: formData.cart_line_2,
                message_id: formData.message_id,
                end_date: formData.end_date,
                email: user.email,
                table: mode === "product" ? "skus" : "brands",
                override: formData.override
            })
        }).then(() => navigate("/all")).catch(console.log)
    }
    // const compare = (a, b) => {
    //     if (!selectedGIDs.gids.includes(a.gid) && selectedGIDs.gids.includes(b.gid)) {
    //         return 1
    //     }
    //     if (selectedGIDs.gids.includes(a.gid) && !selectedGIDs.gids.includes(b.gid)) {
    //         return -1
    //     }
    //     return 0
    // }
    // const compareBrand = (a, b) => {
    //     if (!selectedGIDs.gids.includes(a[1].gid) && selectedGIDs.gids.includes(b[1].gid)) {
    //         return 1
    //     }
    //     if (selectedGIDs.gids.includes(a[1].gid) && !selectedGIDs.gids.includes(b[1].gid)) {
    //         return -1
    //     }
    //     return 0
    // }
    useEffect(() => {
        const filteredProducts = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
        setFilteredProducts(filteredProducts)
        const filteredBrands = brands.filter(b => b.brandTitle.toLowerCase().includes(search.toLowerCase()))
        setFilteredBrands(filteredBrands)
    }, [search])
    useEffect(() => {
        setSelectedGIDs({
            gids: [],
            titles: []
        })
    }, [mode])
    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    }
    const handleOverride = ({ target }) => {
        if (target.value == "true") setFormData({
            ...formData,
            override: true
        })
        else setFormData({
            ...formData,
            override: false
        })
    }
    const handleBulkProducts = (e) => {
        const values = e.target.value.split(",")
        const map = {
            titles: [],
            gids: []
        }
        values.forEach(v => {
            filteredProducts.forEach(p => {
                if (p.skus) {
                    return p.skus.find(s => {
                        if (s.sku && s.sku.toLowerCase() == v.toLowerCase()) {
                            map.titles.push(p.title)
                            if (p.skus.length === 1) map.gids.push(p.gid)
                            else map.gids.push(s.gid)
                        }
                    })
                }
            })
        })
        setSelectedGIDs(map)
    }
    const handleBulkBrands = (e) => {
        const values = e.target.value.split(",")
        const map = {
            titles: [],
            gids: []
        }
        values.forEach(v => {
            filteredBrands.forEach(b => {
                if (b.brandTitle.toLowerCase() == v.toLowerCase()) {
                    map.titles.push(b.title)
                    map.gids.push(b.gid)
                }
            })
        })
        setSelectedGIDs(map)
    }
    return (
        <div class="new-message">
            <div class="new-message__build">
            <div className="new-message__row">
                <h2>New Shipping Message</h2>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="product">Product</option>
                    <option value="brand">Brand</option>
                </select>
            </div>
            <form class="new-message__form" onSubmit={handleSubmit}>
                <div class="new-message__form__row new-message__form__row--flex">
                    <div class="new-message__form__row">
                        <label htmlFor="message_id">Shipping ID</label>
                        <input 
                            id="message_id" 
                            type="text" 
                            name="message_id" 
                            value={formData.message_id}
                            onChange={handleChange}
                        />                    
                    </div>
                    <div class="new-message__form__row">
                        <label htmlFor="end_date">End date</label>
                        <input 
                            id="end_date" 
                            type="date" 
                            name="end_date" 
                            value={formData.end_date}
                            onChange={handleChange}
                        />                    
                    </div>
                    <div class="modal__form__row--half">
                        <label htmlFor="override">Mode</label>
                        <select class="modal__form__override" name="override" onChange={handleOverride}>
                            <option value="false">Default</option>
                            <option value="true">Override</option>
                        </select>
                    </div>
                </div>
                <div class="new-message__form__row">
                    <label htmlFor="pdp_line_1">PDP Line 1</label>
                    <input 
                        id="pdp_line_1" 
                        type="text" 
                        name="pdp_line_1" 
                        value={formData.pdp_line_1}
                        onChange={handleChange}
                    />
                </div>
                <div class="new-message__form__row">
                    <label htmlFor="pdp_line_2">PDP Line 2</label>
                    <input 
                        id="pdp_line_2" 
                        type="text" 
                        name="pdp_line_2" 
                        value={formData.pdp_line_2}
                        onChange={handleChange}
                    />                    </div>
                <div class="new-message__form__row">
                    <label htmlFor="cart_line_1">Cart Line 1</label>
                    <input 
                        id="cart_line_1" 
                        type="text" 
                        name="cart_line_1" 
                        value={formData.cart_line_1}
                        onChange={handleChange}
                    />                    </div>
                <div class="new-message__form__row">
                    <label htmlFor="cart_line_2">Cart Line 2</label>
                    <input 
                        id="cart_line_2" 
                        type="text" 
                        name="cart_line_2" 
                        value={formData.cart_line_2}
                        onChange={handleChange}
                    />                    
                </div>
                {mode === "product" 
                ? 
                    <>
                        <div style={{marginTop: "16px"}} class="new-message__form__row new-message__form__row--flex">
                            <p class="new-message__form__row__title">Selected Products</p>
                            <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="filter" />
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
                        <div style={{ marginTop: "16px" }} class="new-message__form__row new-message__form__row--flex">
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
                        {bulk && <textarea class="modal__textarea" onChange={handleBulkBrands}></textarea>}                    </>
                }
                <button type="submit">SUBMIT</button>
            </form>
            </div>
            <div class="new-message__preview">
                {selectedGIDs.titles.map((t, idx) => {
                    const item = {
                        title: t,
                        gid: selectedGIDs.gids[idx]
                    }
                    return (
                        <div onClick={() => toggleSelect(item)} class="new-message__preview__item">
                            <div class="checked checkbox">&nbsp;</div>
                            <p>{item.title}</p>
                        </div>
                    )}
                )}
            </div>
        </div>
    )
}