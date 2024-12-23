import "./css/Logout.css"

import { useNavigate } from 'react-router-dom'

const Logout = () => {

    const navigate = useNavigate();

    const handleLogout = () => {

        try {

            const myJwt = localStorage.getItem("jwt")
            if (myJwt) {
                localStorage.removeItem("jwt");
                navigate("/");
                return
            }
            else
                return
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="logout">
            <i class="bi bi-box-arrow-left" onClick={() => handleLogout()}></i>
        </div>
    )

}

export default Logout;