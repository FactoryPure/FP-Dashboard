import { useNavigate, useLocation } from "react-router-dom"

export default function Sidebar({ data, screen, setScreen }) {
    const navigate = useNavigate()
    const location = useLocation()
    return (
        <div className="sidebar">
            <div 
                className={location.pathname === "/new" 
                    ? 'sidebar__menu__item sidebar__menu__item--selected'
                    : 'sidebar__menu__item'
                } 
                onClick={() => navigate("/new")}
            >New</div>
            <div 
                className={location.pathname === "/all" 
                    ? 'sidebar__menu__item sidebar__menu__item--selected'
                    : 'sidebar__menu__item'
                } 
                onClick={() => navigate("/all")}
            >All ({data.all_messages && data.all_messages.length})</div>
            <div 
                className={location.pathname === "/ending" 
                    ? 'sidebar__menu__item sidebar__menu__item--selected'
                    : 'sidebar__menu__item'
                } 
                onClick={() => navigate("/ending")}
            >Ending Soon ({data.ending && data.ending.length})</div>
            <div 
                className={location.pathname === "/products" 
                    ? 'sidebar__menu__item sidebar__menu__item--selected'
                    : 'sidebar__menu__item'
                } 
                onClick={() => navigate("/products")}
            >Products ({data.products && data.products.length})</div>
            <div 
                className={location.pathname === "/brands" 
                    ? 'sidebar__menu__item sidebar__menu__item--selected'
                    : 'sidebar__menu__item'
                } 
                onClick={() => navigate("/brands")}
            >Brands ({data.brands && data.brands.length})</div>
        </div>
    )
}