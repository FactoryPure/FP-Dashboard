export default function User({ user, listedUser }){
    const deleteUser = (email) => {
        alert("delete user")
    }
    return (
        <div class="user">
            <h3>{listedUser.email}</h3>
            <p>{listedUser.type}</p>
            <button onClick={deleteUser}>Delete</button>
        </div>
    )
}