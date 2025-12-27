import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import useAuthstore from "../store/authstore"
import useEditorstore from "@/store/editorstore"
import { useEffect, useState } from "react"
import Card from "@/components/Card"
import Homecards from "@/components/Homecards"
import useHomestore from "@/store/homestore"
import Loadingscrenn from "@/components/Loadingscreen"
import useProfilestore from "@/store/profilestore"
import Trending from "@/components/Trending"
import Pa from "@/components/Pa"
import Recom from "@/components/Recom"
import Sblogs from "@/components/Sblogs"
import Editorpicks from "@/components/Editorpicks"
import useFollowingstore from "@/store/followingstore"
import Fcards from "@/components/Fcards"
import { SlUserFollowing } from "react-icons/sl"
import Navbar from "@/components/Navbar"
import toast from "react-hot-toast"


export default function Followingpage() {
    const { logout, setshownav, user, shownav } = useAuthstore()

    const { followingblogs} = useFollowingstore()
    const { userinfo, fetchuser } = useProfilestore()
  



    const [loading, setloading] = useState(false)
    const navigate = useNavigate()

    const fetchl = async () => {
        setloading(true)
        try {
          
            await fetchuser()
        
        } catch (error) {
             toast.error(error.response?.data?.msg || "Something went wrong");
        } finally {
            setloading(false)
        }
    }






    if (loading) return <Loadingscrenn />
    return (

        <div className="  relative h-screen bg-base-100 ">
            <Sidebar />





            <div className="">


                <Navbar/>


                <div className="flex justify-center mt-5">
                    <h1 className="flex items-center gap-2 text-2xl font-bold"> <SlUserFollowing/>Following</h1>
                </div>


                <div className="relative ">

                  
                    <Fcards/>

                </div>








            </div>




        </div>
    )
}