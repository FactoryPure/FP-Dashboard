import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setSections } from "../../redux/sections"

export default function ProductScreen() {
    const [currentProduct, setCurrentProduct] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const { product } = useSelector(state => state).sections
    const handleGet = () => {
        setLoading(true)
        dispatch(setSections({
            product: "",
            description: "",
            checkmarks: [],
            plugs: [],
            features: [],
            specifications: { left: [], right: [] },
            packageContents: [],
            warranty: "",
            manuals: []
        }))
        fetch(`https://webdevclothing.com/descriptions/${currentProduct}`).then(res => res.json()).then(res => {
            if (res) {
                dispatch(setSections({
                    product: {
                        gid: res.gid,
                        title: res.title,
                        img_src: res.img_src
                    },
                    description: res.description,
                    checkmarks: res.checkmarks,
                    plugs: res.plugs,
                    features: res.features,
                    specifications: { left: res.specifications_left, right: res.specifications_right },
                    packageContents: res.package_contents,
                    warranty: res.warranty,
                    manuals: res.manuals
                }))
            }
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }
    const handleChange = ({ target }) => {
        setCurrentProduct(target.value)
    }
    const handleChangeProduct = () => {
        dispatch(setSections({
            product: "",
            description: "",
            checkmarks: [],
            plugs: [],
            features: [],
            specifications: { left: [], right: [] },
            packageContents: [],
            warranty: "",
            manuals: []
        }))
    }
    useEffect(() => {
        if (product && product.gid) {
            setCurrentProduct(product.gid.split("/")[4])
        }
    }, [])
    return (
        <>
            <h2 style={{maxWidth: '600px', margin: '16px auto', textAlign: 'center'}}>{product && product.title}</h2>
            {product && product.img_src && <img src={product.img_src} width="400" height="400" style={{objectFit: 'contain'}}/>}
            {loading && (
                <svg style={{width: '300px', height: '300px'}} version="1.1" id="L2" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    viewBox="0 0 100 100" enable-background="new 0 0 100 100">
                    <circle fill="none" stroke="orange" stroke-width="4" stroke-miterlimit="10" cx="50" cy="50" r="48"/>
                    <line fill="none" stroke-linecap="round" stroke="orange" stroke-width="4" stroke-miterlimit="10" x1="50" y1="50" x2="85" y2="50.5">
                    <animateTransform 
                        attributeName="transform" 
                        dur="2s"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        repeatCount="indefinite" />
                    </line>
                    <line fill="none" stroke-linecap="round" stroke="orange" stroke-width="4" stroke-miterlimit="10" x1="50" y1="50" x2="49.5" y2="74">
                    <animateTransform 
                        attributeName="transform" 
                        dur="15s"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        repeatCount="indefinite" />
                    </line>
                </svg>
            )
            }
            {(!product && !loading) && <h2 class="productScreen-heading">Find a product</h2>}
            {!product && <input class="product-input" type="text" onChange={handleChange} value={currentProduct} placeholder="Product ID Number"/>}
            {!product ? <button onClick={handleGet}>GET PRODUCT</button> : <button style={{marginTop: '32px'}} onClick={handleChangeProduct}>CHANGE PRODUCT</button>}
        </>
    )
}