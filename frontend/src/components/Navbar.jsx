import useAuthstore from "@/store/authstore"
import Notificaion from "./Notificaton"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import useProfilestore from "@/store/profilestore"
import useNotificationstore from "@/store/notificationstore"
import { socket } from "@/services/Socketp"

export default function Navbar() {
    const { setshownav } = useAuthstore()
    const navigate = useNavigate()
    const { fetchuser, userinfo } = useProfilestore()
    const { initSocketListener } = useNotificationstore()
    const {user} = useAuthstore()

    useEffect(() => {
        initSocketListener()


        return () => socket.off("newNotification")
    }, [])



    useEffect(() => {
        fetchuser()
    }, [user])


    useEffect(() => {
        if (user?.id) {
            socket.emit("addUser", user.id);
        }
    }, [user]);


   
    
    return (
        <div className="flex items-center justify-between sticky top-0  shadow p-4 bg-white z-20 " >
            <div className="">
                <h1 className="text-4xl font-bold cursor-pointer" onClick={(e) => {

                    navigate("/home")
                }}>  BlogApp</h1>

            </div>


            <div className="flex items-center gap-6">


                <div onClick={(e) => {
                    e.stopPropagation()
                }}>
                    <Notificaion />

                </div>


                <img src={userinfo?.profilepic} alt="img" className="w-8 h-8 bg-black rounded-full" onClick={(e) => {
                    e.stopPropagation()
                    setshownav()
                }} />



            </div>




        </div>
    )
}