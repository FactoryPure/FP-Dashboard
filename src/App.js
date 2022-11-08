import { useEffect, useState } from 'react';
import './App.css';
import BrandScreen from './brands/BrandScreen';
import Layout from './layout/Layout';
import NewMessageScreen from './newMessage/NewMessageScreen';
import ProductScreen from './products/ProductScreen';
import ComboScreen from "./combo/ComboScreen"
import { Routes, Route, useNavigate, useSearchParams } from "react-router-dom"
import Users from './users/Users';

function App() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [data, setData] = useState({})
  const [selectedItem, setSelectedItem] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [user, setUser] = useState(null)
  const [screen, setScreen] = useState("all")
  const [search, setSearch] = useState("")

  const getData = async () => {
    const result = {
      products: await fetch("https://factorypure-server.herokuapp.com/products").then(res => res.json()),
      collections: await fetch("https://factorypure-server.herokuapp.com/collections").then(res => res.json()),
      brands: await fetch("https://factorypure-server.herokuapp.com/shipping").then(res => res.json()),
      overrides: await fetch("https://factorypure-server.herokuapp.com/shipping?override=true").then(res => res.json())
    }
    result.products = result.products.map(p => {
      return {
        title: p.title,
        vendor: p.vendor,
        img_src: p.img_src,
        gid: p.gid,
        skus: JSON.parse(p.skus)
      }
    })
    result.products = result.products.map(p => {
      const matchingOverride = result.overrides.find(o => o.gid === p.gid)
      return {
        ...p,
        ...matchingOverride,
        skus: p.skus.map(s => {
          const matchingVariantOverride = result.overrides.find(o => o.gid === s.gid)
          return {
              ...s,
              ...matchingVariantOverride
          }
        })
      }
    })
    const hasDetails = result.products.filter(c => c.pdp_line_1 || c.pdp_line_2 || c.cart_line_1 || c.cart_line_2 || c.skus.find(s => s.pdp_line_1 || s.pdp_line_2 || s.cart_line_1 || s.cart_line_2))
    const noDetails = result.products.filter(c => !c.pdp_line_1 && !c.pdp_line_2 && !c.cart_line_1 && !c.cart_line_2 && !c.skus.find(s => s.pdp_line_1 || s.pdp_line_2 || s.cart_line_1 || s.cart_line_2))
    result.products = [...hasDetails, ...noDetails]
    const brandmap = {}
    result.products.forEach(item => {
        if(!brandmap[item.vendor]) {
            const collection = result.collections.find(c => c.handle === item.vendor.replaceAll(" ", "-").replaceAll("&", "-").replaceAll("'", "").replaceAll('"', "").replaceAll(".", "").toLowerCase())
            const shipping = result.brands.find(b => {
                const gid = collection ? collection.gid : ''
                return b.gid === gid
            })
            brandmap[item.vendor] = {
                ...collection,
                ...shipping
            }
        }
    })
    const comboArray = Object.keys(brandmap).map(key => [key, brandmap[key]])
    const hasShipping = comboArray.filter(c => c[1].pdp_line_1 || c[1].pdp_line_2 || c[1].cart_line_1 || c[1].cart_line_2).sort((a,b) => a[0] - b[0])
    const noShipping = comboArray.filter(c => !c[1].pdp_line_1 && !c[1].pdp_line_2 && !c[1].cart_line_1 && !c[1].cart_line_2).sort((a,b) => a[0] - b[0])
    result.brands = [...hasShipping, ...noShipping]
    const endingProducts = result.products.filter(p => {
      if (p.end_date) {
        const endDate = new Date(p.end_date).getTime()
        const alertTime = Date.now() + 86400000
        if (endDate <= alertTime) {
          return true
        }
      }
      return false
    })
    const endingBrands = result.brands.filter(b => {
      if (b[1].end_date) {
        const endDate = new Date(b[1].end_date).getTime()
        const alertTime = Date.now() + 86400000
        if (endDate <= alertTime) {
          return true
        }
      }
      return false
    })
    result.ending = [...endingProducts, ...endingBrands]
    result.all_messages = [...hasDetails, ...hasShipping]

    result.productsMappedById = {}
    result.products.forEach(p => {
      if (!result.productsMappedById[p.message_id]) {
        result.productsMappedById[p.message_id] = {
          end_date: p.end_date,
          products: []
        }
      }
      result.productsMappedById[p.message_id].products.push(p)
    })
    result.brandsMappedById = {}
    result.brands.forEach(b => {
      if (!result.brandsMappedById[b[1].message_id]) {
        result.brandsMappedById[b[1].message_id] = {
          end_date: b.end_date,
          brands: []
        }
      }
      result.brandsMappedById[b[1].message_id].brands.push(b)
    })
    return result
  }

  useEffect(() => {
    const token = sessionStorage.getItem("session")
    console.log(searchParams.get("token"))
    if (token) {
      fetch(`https://factorypure-server.herokuapp.com/users/verify?token=${token}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setUser(res.user)
          //navigate("/all")
        }
      })
    } else if (user) {
      navigate("/")
    } else {
      navigate("/login")
    }
    getData().then(setData)
    fetch("https://factorypure-server.herokuapp.com/notifications?email=gjarman@factorypure.com").then(res => res.json()).then(res => setNotifications(res.notifications))
    return () => clearInterval(getNotifications)
  }, [])

  let getNotifications = setInterval(() => {},1)
  const checkForNotifications = (notifications) => {
    clearInterval(getNotifications)
    getNotifications = setInterval(() => {
      fetch("https://factorypure-server.herokuapp.com/notifications?email=gjarman@factorypure.com").then(res => res.json()).then(res => {
        if (JSON.stringify(res.notifications) != JSON.stringify(notifications)) {
          setNotifications(res.notifications)
          getData().then(setData)
        }
      })
    }, 3000)
  }
  useEffect(() => {
    checkForNotifications(notifications)
    return () => clearInterval(getNotifications)
  }, [notifications])
  useEffect(() => {
  }, [data])
  const handleLogin = async (e) => {
    e.preventDefault()
    const response = await fetch("https://factorypure-server.herokuapp.com/users/login", {
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
      setUser(response.user)
      sessionStorage.setItem("session", response.user.token)
      navigate("/all")
    } else {
      alert("Invalid login")
    }
  }
  const handleCreate = async (e) => {
    e.preventDefault()
    const token = searchParams.get("token")
    if (!token) alert("Invalid token")
    const response = await fetch("https://factorypure-server.herokuapp.com/users/create", {
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
      setUser(response.user)
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
        user={user}
        data={data}
        notifications={notifications}
        selectedItem={selectedItem} 
        setSelectedItem={setSelectedItem} 
        screen={screen} 
        setScreen={setScreen} 
        title={"Shipping"}
      >
        <Routes>
          <Route path="/all" element={
            <ComboScreen 
              user={user}
              setSelectedItem={setSelectedItem} 
              data={data} 
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
              setSelectedItem={setSelectedItem} 
              title={"Ending Soon"} 
              items={data.ending} 
              products={data.products} 
              search={search} 
              setSearch={setSearch} 
              setScreen={setScreen} 
            /> 
          }/>
          <Route path="/products" element={
            <ProductScreen 
              user={user}
              setSelectedItem={setSelectedItem} 
              products={data.products} 
              search={search} 
              setSearch={setSearch} 
              setScreen={setScreen} 
            />
          }/>
          <Route path="/brands" element={
            <BrandScreen 
              user={user}
              setSelectedItem={setSelectedItem} 
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
              setSelectedItem={setSelectedItem} 
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
          <form onSubmit={handleLogin} class="login">
            <input type="email" name="email" id="email" placeholder="email" />
            <input type="password" name="password" id="password" placeholder="password" />
            <button type="submit">SUBMIT</button>
          </form>
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
