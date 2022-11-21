import { useEffect, useState } from 'react';
import './App.css';
import BrandScreen from './brands/BrandScreen';
import Layout from './layout/Layout';
import NewMessageScreen from './newMessage/NewMessageScreen';
import ProductScreen from './products/ProductScreen';
import ComboScreen from "./combo/ComboScreen"
import { Routes, Route, useNavigate, useSearchParams } from "react-router-dom"
import Users from './users/Users';
import { useDispatch, useSelector } from "react-redux"
import { setData, getData } from './redux/data';
import { getUser, setUser } from './redux/user';
import { getSelected } from './redux/selected';

function App() {
  const navigate = useNavigate()
  const { data, user, selected } = useSelector(state => state)
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  // const [selectedItem, setSelectedItem] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [screen, setScreen] = useState("all")
  const [search, setSearch] = useState("")

  const hasDetails = (item) => {
    if (
      item.pdp_line_1 ||
      item.pdp_line_2 ||
      item.or_pdp_line_1 ||
      item.or_pdp_line_2 ||
      item.cart_line_1 ||
      item.cart_line_2 ||
      item.or_cart_line_1 ||
      item.or_cart_line_2
    ) {
      return true
    }
    return false
  }
  const formatVendor = (vendor) => {
    return vendor.replaceAll(" ", "-").replaceAll("&", "-").replaceAll("'", "").replaceAll('"', "").replaceAll(".", "").toLowerCase()
  }
  const initData = async () => {
    const result = {
      products: await fetch("https://webdevclothing.com/products").then(res => res.json()),
      collections: await fetch("https://webdevclothing.com/collections").then(res => res.json()),
    }
    const shipping_brands = await fetch("https://webdevclothing.com/shipping").then(res => res.json())
    const shipping_skus = await fetch("https://webdevclothing.com/shipping?table=skus").then(res => res.json())
    result.products = result.products.map(p => {
      const matchingShippingProduct = shipping_skus.find(s => s.gid === p.gid) ? shipping_skus.find(s => s.gid === p.gid) : {}
      return {
        ...p,
        ...matchingShippingProduct,
        skus: JSON.parse(p.skus).map(v => {
          const matchingShippingSku = shipping_skus.find(s => s.gid === v.gid) ? shipping_skus.find(s => s.gid === v.gid) : {}
          return {
            ...v,
            ...matchingShippingSku
          }
        })
      }
    })
    result.products = [
      ...result.products.filter(c => hasDetails(c) || c.skus.find(s => hasDetails(s))), 
      ...result.products.filter(c => !hasDetails(c) && !c.skus.find(s => hasDetails(s)))
    ]
    result.collections = result.collections.map(c => {
      const matchingShippingBrand = shipping_brands.find(b => b.gid === c.gid) ? shipping_brands.find(b => b.gid === c.gid) : {}
      return {
        ...c,
        ...matchingShippingBrand
      }
    })
    const brandmap = {}
    result.products.forEach(item => {
      if (item.vendor) {
        if(!brandmap[item.vendor]) {
          brandmap[item.vendor] = result.collections.find(c => c.handle === formatVendor(item.vendor))
        }
      }
    })
    const comboArray = Object.keys(brandmap).map(key => {
      return {
        ...brandmap[key],
        brandTitle: key
      }
    })
    const hasShipping = comboArray.filter(c => hasDetails(c))
    const noShipping = comboArray.filter(c => !hasDetails(c))
    result.brands = [...hasShipping, ...noShipping]
    const endingProducts = result.products.filter(p => {
      // if (p.end_date) {
      //   const endDate = new Date(p.end_date).getTime()
      //   const alertTime = Date.now() + (86400000 * 4)
      //   if (endDate <= alertTime) {
      //     return true
      //   }
      // }
      // if (p.or_end_date) {
      //   const overrideEndDate = new Date(p.or_end_date).getTime()
      //   const alertTime = Date.now() + (86400000 * 4)
      //   if (overrideEndDate <= alertTime) {
      //     return true
      //   }
      // }
      // return false
      return p.end_date || p.or_end_date
    })
    const endingBrands = result.brands.filter(b => {
      // if (b.end_date) {
      //   const endDate = new Date(b.end_date).getTime()
      //   const alertTime = Date.now() + (86400000 * 4)
      //   if (endDate <= alertTime) {
      //     return true
      //   }
      // }
      return b.end_date || b.or_end_date
    })
    result.ending = [...endingProducts, ...endingBrands].sort((a, b) => {
      const aEnd = a.end_date ? new Date(a.end_date).getTime() : Infinity
      const aOrEnd = a.or_end_date ? new Date(a.or_end_date).getTime() : Infinity
      const aSoonest = aEnd < aOrEnd ? aEnd : aOrEnd
      const bEnd = b.end_date ? new Date(b.end_date).getTime() : Infinity
      const bOrEnd = b.or_end_date ? new Date(b.or_end_date).getTime() : Infinity
      const bSoonest = bEnd < bOrEnd ? bEnd : bOrEnd
      console.log(aSoonest, bSoonest)
      return aSoonest > bSoonest ? 1 : -1
    })
    result.all_messages = [
      ...result.products.filter(c => hasDetails(c) || c.skus.find(s => hasDetails(s))), 
      ...result.brands.filter(c => hasDetails(c))
    ]
    console.log(result)
    result.productsDefaultMap = {}
    result.products.forEach(p => {
      const messageId = p.message_id ? p.message_id : 'ungrouped'
      if (!result.productsDefaultMap[messageId]) {
        const body = messageId === "ungrouped" ? {} : {
          title: p.message_id,
          pdp_line_1: p.pdp_line_1,
          pdp_line_2: p.pdp_line_2,
          cart_line_1: p.cart_line_1,
          cart_line_2: p.cart_line_2,
          message_id: p.message_id,
          end_date: p.end_date,
          last_updated: p.last_updated
        }
        result.productsDefaultMap[messageId] = {
          ...body,
          products: []
        }
      }
      result.productsDefaultMap[messageId].products.push(p)
      result.productsDefaultMap[messageId].title = `${result.productsDefaultMap[messageId].message_id} (${result.productsDefaultMap[messageId].products.length})`
    })
    result.productsOverrideMap = {}
    result.products.forEach(p => {
      const messageId = p.or_message_id ? p.or_message_id : 'ungrouped'
      if (!result.productsOverrideMap[messageId]) {
        const body = messageId === "ungrouped" ? {} : {
          title: p.or_message_id,
          or_pdp_line_1: p.or_pdp_line_1,
          or_pdp_line_2: p.or_pdp_line_2,
          or_cart_line_1: p.or_cart_line_1,
          or_cart_line_2: p.or_cart_line_2,
          or_message_id: p.or_message_id,
          or_end_date: p.or_end_date,
          last_updated: p.last_updated
        }
        result.productsOverrideMap[messageId] = {
          ...body,
          products: []
        }
      }
      result.productsOverrideMap[messageId].products.push(p)
      result.productsOverrideMap[messageId].title = `${result.productsOverrideMap[messageId].or_message_id} (${result.productsOverrideMap[messageId].products.length})`
    })
    result.brandsDefaultMap = {}
    result.brands.forEach(b => {
      const messageId = b.message_id ? b.message_id : 'ungrouped'
      if (!result.brandsDefaultMap[messageId]) {
        const body = messageId === "ungrouped" ? {} : {
          title: b.message_id,
          pdp_line_1: b.pdp_line_1,
          pdp_line_2: b.pdp_line_2,
          cart_line_1: b.cart_line_1,
          cart_line_2: b.cart_line_2,
          message_id: b.message_id,
          end_date: b.end_date,
          last_updated: b.last_updated
        }
        result.brandsDefaultMap[messageId] = {
          ...body,
          brands: []
        }
      }
      result.brandsDefaultMap[messageId].brands.push(b)
      result.brandsDefaultMap[messageId].title = `${result.brandsDefaultMap[messageId].message_id} (${result.brandsDefaultMap[messageId].brands.length})`

    })
    result.brandsOverrideMap = {}
    result.brands.forEach(b => {
      const messageId = b.or_message_id ? b.or_message_id : 'ungrouped'
      if (!result.brandsOverrideMap[messageId]) {
        const body = messageId === "ungrouped" ? {} : {
          title: b.or_message_id,
          or_pdp_line_1: b.or_pdp_line_1,
          or_pdp_line_2: b.or_pdp_line_2,
          or_cart_line_1: b.or_cart_line_1,
          or_cart_line_2: b.or_cart_line_2,
          or_message_id: b.or_message_id,
          or_end_date: b.or_end_date,
          last_updated: b.last_updated
        }
        result.brandsOverrideMap[messageId] = {
          ...body,
          brands: []
        }
      }
      result.brandsOverrideMap[messageId].brands.push(b)
      result.brandsOverrideMap[messageId].title = `${result.brandsOverrideMap[messageId].or_message_id} (${result.brandsOverrideMap[messageId].brands.length})`
    })
    const recentlyEdited = Date.now() - (1000 * 60 * 60 * 24 * 7)
    result.recents = [
      ...result.products.filter(p => p.last_updated && new Date(parseInt(p.last_updated)).getTime() > recentlyEdited),
      ...result.brands.filter(b => b.last_updated && new Date(parseInt(b.last_updated)).getTime() > recentlyEdited)
    ]
    console.log(result.recents)
    return result
  }

  useEffect(() => {
    const token = sessionStorage.getItem("session")
    const queryToken = searchParams.get("token")
    if (token) {
      fetch(`https://webdevclothing.com/users/verify?token=${token}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          dispatch(setUser(res.user))
          //navigate("/all")
        }
      })
    } else if (user) {
      navigate("/")
    } else if (!queryToken) {
      navigate("/login")
    }
    initData().then(res => dispatch(setData(res)))
    if (user) {
      fetch(`https://webdevclothing.com/notifications?email=${user.email}`).then(res => res.json()).then(res => setNotifications(res.notifications))
    }
    return () => clearInterval(getNotifications)
  }, [])

  let getNotifications = setInterval(() => {},1)
  const checkForNotifications = (notifications, user) => {
    clearInterval(getNotifications)
    getNotifications = setInterval(() => {
      if (user) {
        fetch(`https://webdevclothing.com/notifications?email=${user.email}`).then(res => res.json()).then(res => {
          if (JSON.stringify(res.notifications) != JSON.stringify(notifications)) {
            setNotifications(res.notifications)
            initData().then(res => dispatch(setData(res)))
          }
        })
      }
    }, 3000)
  }
  useEffect(() => {
    checkForNotifications(notifications, user)
    return () => clearInterval(getNotifications)
  }, [notifications, user])
  useEffect(() => {
  }, [data])
  const handleLogin = async (e) => {
    e.preventDefault()
    const response = await fetch("https://webdevclothing.com/users/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: e.target['email'].value,
        password: e.target['password'].value
      })
    }).then(res => res.json())
    if (response.success) {
      dispatch(setUser(response.user))
      sessionStorage.setItem("session", response.user.token)
      navigate("/all")
    } else {
      alert("Invalid login")
    }
  }
  const handleCreate = async (e) => {
    e.preventDefault()
    const token = searchParams.get("token")
    console.log(token, searchParams)
    if (!token) alert("Invalid token")
    const response = await fetch("https://webdevclothing.com/users/create", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: e.target['email'].value,
        password: e.target['password'].value,
        token
      })
    }).then(res => res.json())
    if (response.success) {
      dispatch(setUser(response.user))
      sessionStorage.setItem("session", response.user.token)
      navigate("/all")
    } else {
      alert("Invalid token")
    }

  }
  return (
    <>
    {(user && data.products)
    ?
      <Layout 
        notifications={notifications}
        screen={screen} 
        setScreen={setScreen} 
        title={"Shipping"}
      >
        <Routes>
          <Route path="/all" element={
            <ComboScreen 
              title={"All"} 
              items={data.all_messages} 
              products={data.products} 
              search={search} 
              setSearch={setSearch} 
              setScreen={setScreen} 
            />
          }/>
          <Route path="/ending" element={ 
            <ComboScreen 
              user={user}
              title={"Ending"} 
              items={data.ending} 
              products={data.products} 
              search={search} 
              setSearch={setSearch} 
              setScreen={setScreen} 
            /> 
          }/>
          <Route path="/recent" element={ 
            <ComboScreen 
              user={user}
              title={"Recently Edited"} 
              items={data.recents} 
              products={data.products} 
              search={search} 
              setSearch={setSearch} 
              setScreen={setScreen} 
            /> 
          }/>
          <Route path="/products" element={
            <ProductScreen 
              user={user}
              products={data.products} 
              search={search} 
              setSearch={setSearch} 
              setScreen={setScreen} 
            />
          }/>
          <Route path="/brands" element={
            <BrandScreen 
              user={user}
              brands={data.brands} 
              setScreen={setScreen} 
              search={search} 
              setSearch={setSearch} 
              products={data.products} 
            />
          }/>
          <Route path="/new" element={
            <NewMessageScreen 
              user={user}
              brands={data.brands} 
              setScreen={setScreen} 
              search={search} 
              setSearch={setSearch} 
              products={data.products} 
              type={screen.split("-")[1]} 
            />
          }/>
          <Route path="/users" element={
            <Users />
          } />
          <Route element={<h1>PAGE NOT FOUND</h1>}/>
        </Routes>
      </Layout>
    :
      <Routes>
        <Route path="/login" element={
          <>
            <form onSubmit={handleLogin} class="login">
              <input type="email" name="email" id="email" placeholder="email" />
              <input type="password" name="password" id="password" placeholder="password" />
              <button type="submit">SUBMIT</button>
            </form>
            <style>
              {`
                body {
                  padding: 0;
                }
              `}
            </style>
          </>
        }/>
        <Route path="/create" element={
          <>
          <h2>Create Account</h2>
          <form onSubmit={handleCreate} class="login">
            <input type="email" name="email" id="email" placeholder="email" />
            <input type="password" name="password" id="password" placeholder="password" />
            <button type="submit">SUBMIT</button>
          </form>
          </>
        }/>
      </Routes>
    }
    </>
  );
}

export default App;
