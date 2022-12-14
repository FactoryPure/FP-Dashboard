import { useEffect, useState } from "react"
import User from "./User"

export default function Users({ user }) {
    const [users, setUsers] = useState([])
    const [showCreate, setShowCreate] = useState(false)
    useEffect(() => {
        fetch("https://webdevclothing.com/users").then(res => res.json()).then(setUsers)
    }, [])
    const createUser = (e) => {
        e.preventDefault()
        fetch("https://webdevclothing.com/users/setup", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: e.target['email'].value,
                type: e.target['type'].value
            })
        }).then(res => res.json()).then(res => alert(res.message))
    }
    return (
        <div class="products">
            <div class="products__row">
                <h2>Users</h2>
                <button onClick={() => setShowCreate(true)}>Create</button>
                {showCreate &&<form onSubmit={createUser}>
                    <input type="email" name="email" id="email" />
                    <select name="type" id="type">
                        <option value="Client">User</option>
                        <option value="Admin">Admin</option>
                        <option value="SuperAdmin">SuperAdmin</option>
                    </select>
                    <button type="submit">SUBMIT</button>
                    <button type="button" onClick={() => setShowCreate(false)}>CANCEL</button>
                </form>}
            </div>
            {users.map(u => <User user={user} listedUser={u} />)}
        </div>
    )
}