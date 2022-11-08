import logo from "../logo.png"

export default function Topbar({ title, user, notifications }) {
    const showNotifications = () => {
        console.log(notifications)
        fetch("https://factorypure-server.herokuapp.com/notifications", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
                payload: []
            })
        })
    }
    return (
        <div className="topbar">
            <div className="topbar__row">
                <img
                    src={logo}
                    alt="logo"
                    width="50"
                    height="50"
                    loading="lazy"
                />
            </div>
            <h1 className="topbar__heading">{ title }</h1>
            <div onClick={showNotifications} class="topbar__notifications">
                Notifications: {notifications.length}
            </div>
        </div>
    )
}