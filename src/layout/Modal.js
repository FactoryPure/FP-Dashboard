import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Modal({ user, data, selectedItem, setSelectedItem }) {
    const [overwritten, setOverwritten] = useState(false)
    const navigate = useNavigate()
    const handleChange = ({ target }) => {
        if (selectedItem.type == "product") {
            if (target.name === "message_id" && !data.productsMappedById[target.value]) {
                setOverwritten(false)
                setSelectedItem({
                    ...selectedItem,
                    multi_title: null,
                    multi_gid: null,
                    [target.name]: target.value
                })
            } else {
                setSelectedItem({
                    ...selectedItem,
                    [target.name]: target.value
                })
            }
        } else {
            if (target.name === "message_id" && !data.brandsMappedById[target.value]) {
                setOverwritten(false)
                setSelectedItem({
                    ...selectedItem,
                    multi_title: null,
                    multi_gid: null,
                    [target.name]: target.value
                })
            } else {
                setSelectedItem({
                    ...selectedItem,
                    [target.name]: target.value
                })
            }
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const override = !e.target["gid"].value.includes("Collection")
        let gids;
        if (selectedItem.multi_gid) {
            if (selectedItem.multi_gid.includes(selectedItem.gid)) gids = selectedItem.multi_gid
            else gids = [...selectedItem.multi_gid, selectedItem.gid]
        } else {
            gids = [selectedItem.gid]
        }
        fetch("https://factorypure-server.herokuapp.com/shipping", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gid: gids,
                pdp_line_1: selectedItem.pdp_line_1,
                pdp_line_2: selectedItem.pdp_line_2,
                cart_line_1: selectedItem.cart_line_1,
                cart_line_2: selectedItem.cart_line_2,
                message_id: selectedItem.message_id ? selectedItem.message_id : random,
                end_date: selectedItem.end_date,
                email: user.email,
                override
            })
        })
        .then(() => {
            setSelectedItem(null)
            navigate("/all")
        })
        // .then(res => res.json())
        // .then(console.log)
        .catch(console.log)
        
    }
    const random = String(Math.floor(Date.now()))
    useEffect(() => {
        if (!selectedItem) setOverwritten(false)
        if (selectedItem && selectedItem.type == "Product") {
            if (selectedItem && data.productsMappedById[selectedItem.message_id] && data.productsMappedById[selectedItem.message_id].products.length >= 1 && !overwritten && selectedItem.message_id != undefined) {
                setOverwritten(true)
                const group = data.productsMappedById[selectedItem.message_id]
                let multi_title;
                if (data.productsMappedById[selectedItem.message_id].products.find(p => p.gid == selectedItem.gid) && data.productsMappedById[selectedItem.message_id].products.length > 1) {
                    multi_title = `${selectedItem.title} + ${group.products.length - 1} More`
                } else if (data.productsMappedById[selectedItem.message_id].products.length > 1) {
                    multi_title = `${selectedItem.title} + ${group.products.length} More`
                }
                setSelectedItem({
                    ...selectedItem,
                    multi_title: multi_title,
                    multi_gid: group.products.map(p => p.gid),
                    pdp_line_1: group.products[0].pdp_line_1,
                    pdp_line_2: group.products[0].pdp_line_2,
                    cart_line_1: group.products[0].cart_line_1,
                    cart_line_2: group.products[0].cart_line_2,
                    message_id: group.products[0].message_id,
                    end_date: group.products[0].end_date
                })
            }
        } else if (selectedItem && selectedItem.type == "Brand") {
            if (selectedItem && data.brandsMappedById[selectedItem.message_id] && data.brandsMappedById[selectedItem.message_id].brands.length >= 1 && !overwritten && selectedItem.message_id != undefined) {
                setOverwritten(true)
                const group = data.brandsMappedById[selectedItem.message_id]
                let multi_title;
                if (data.brandsMappedById[selectedItem.message_id].brands.find(b => b[1].gid == selectedItem.gid) && data.brandsMappedById[selectedItem.message_id].brands.length > 1) {
                    multi_title = `${selectedItem.title} + ${group.brands.length - 1} More`
                } else if (data.brandsMappedById[selectedItem.message_id].brands.length > 1) {
                    multi_title = `${selectedItem.title} + ${group.brands.length} More`
                }
                setSelectedItem({
                    ...selectedItem,
                    multi_title: multi_title,
                    multi_gid: group.brands.map(b => b[1].gid),
                    pdp_line_1: group.brands[0][1].pdp_line_1,
                    pdp_line_2: group.brands[0][1].pdp_line_2,
                    cart_line_1: group.brands[0][1].cart_line_1,
                    cart_line_2: group.brands[0][1].cart_line_2,
                    message_id: group.brands[0][1].message_id,
                    end_date: group.brands[0][1].end_date
                })
            }
        }
    }, [selectedItem])
    return (
        <div className={selectedItem ? 'modal modal--visible' : 'modal'}>
            {selectedItem && (
                <div className="modal__inner">
                    <div className="modal__close" onClick={() => setSelectedItem(null)}>&times;</div>
                    <h2 className="modal__title">{selectedItem.multi_title ? selectedItem.multi_title : selectedItem.title}</h2>
                    <form className="modal__form" onSubmit={handleSubmit}>
                        <input type="hidden" id="gid" name="gid" value={selectedItem.gid} />
                        <div className="modal__form__row">
                            <p class="modal__form__type">{selectedItem.type}</p>
                        </div>
                        <div className="modal__form__row">
                            <label htmlFor="pdp_line_1">PDP Line 1</label>
                            <input 
                                id="pdp_line_1"
                                name="pdp_line_1"
                                value={selectedItem.pdp_line_1}
                                onChange={handleChange}
                                type="text"
                            />
                        </div>
                        <div className="modal__form__row">
                            <label htmlFor="message_id">PDP Line 2</label>
                            <input 
                                id="pdp_line_2"
                                name="pdp_line_2"
                                value={selectedItem.pdp_line_2}
                                onChange={handleChange}
                                type="text"
                            />
                        </div>
                        <div className="modal__form__row">
                            <label htmlFor="pdp_line_1">Cart Line 1</label>
                            <input 
                                id="cart_line_1"
                                name="cart_line_1"
                                value={selectedItem.cart_line_1}
                                onChange={handleChange}
                                type="text"
                            />
                        </div>
                        <div className="modal__form__row">
                            <label htmlFor="pdp_line_1">Cart Line 2</label>
                            <input 
                                id="cart_line_2"
                                name="cart_line_2"
                                value={selectedItem.cart_line_2}
                                onChange={handleChange}
                                type="text"
                            />
                        </div>
                        <div className="modal__form__row modal__form__row--flex">
                            <div class="modal__form__row--half">
                                <label htmlFor="message_id">Shipping ID</label>
                                <input 
                                    id="message_id"
                                    name="message_id"
                                    value={selectedItem.message_id}
                                    onChange={handleChange}
                                    type="text"
                                />
                            </div>
                            <div class="modal__form__row--half">
                                <label htmlFor="end_date">End Date</label>
                                <input 
                                    id="end_date"
                                    name="end_date"
                                    value={selectedItem.end_date}
                                    onChange={handleChange}
                                    type="date"
                                />
                            </div>
                        </div>
                        <button className="modal__form__submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    )
}