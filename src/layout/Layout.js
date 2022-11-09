import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import "./Layout.css"
import Modal from "./Modal";
import { useEffect } from "react";

export default function Layout({ children, notifications, title }) {
    return (
        <>
            <Topbar title={title} notifications={notifications} />
            <Sidebar />
            <Modal />
            <main className="content">
                {children}
            </main>
        </>
    )
}