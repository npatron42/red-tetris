import "./css/Welcome.css"

import { useAuth } from "../providers/UserAuthProvider";


const Welcome = () => {

    const {myUser} = useAuth()

    return (
        <div className="welcomeMessage">
            <i className="bi bi-person-circle iconWelcome"></i>
            <span className="welcomeWriting">Welcome</span>
            <span className="nameWriting">{myUser.username}</span>
            <span className="welcomeWriting">!</span>
        </div>
    )

}

export default Welcome;