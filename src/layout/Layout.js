import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import "./Layout.css"
import Modal from "./Modal";
import { useEffect } from "react";

export default function Layout({ children, user, data, notifications, selectedItem, setSelectedItem, screen, setScreen, title }) {
    return (
        <>
            <Topbar user={user} title={title} notifications={notifications} />
            <Sidebar data={data} screen={screen} setScreen={setScreen} />
            <Modal data={data} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
            <main className="content">
                {children}
            </main>
        </>
    )
}