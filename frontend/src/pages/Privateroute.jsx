import { useContext } from "react"
import { Navigate } from "react-router-dom"
import useAuthstore from "../store/authstore"





const Privateroute = ({children}) => {
    const {user} = useAuthstore()
    return user ? children : <Navigate to="/" />
}

export default Privateroute;