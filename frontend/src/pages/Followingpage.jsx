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
            console.log(error);
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        fetchl()

    }, [])




    if (loading) return <Loadingscrenn />
    return (

        <div className="  relative bg-base-100 ">
            <Sidebar />





            <div className="">


                <div className="flex items-center justify-between sticky top-0  shadow p-4 bg-white z-20 " >
                    <h1 className="text-4xl font-bold cursor-pointer" onClick={(e) => {

                        navigate("/home")
                    }}>  BlogApp</h1>





                    <div className="flex ">

                        <img src={userinfo.profilepic} alt="img" className="w-8 h-8 bg-black rounded-full" onClick={(e) => {

                            setshownav
                        }} />
                    </div>

                </div>


                <div className="flex justify-center mt-5">
                    <h1 className="flex items-center gap-2 text-2xl font-bold"> <SlUserFollowing/>Following</h1>
                </div>


                <div className="relative">

                  
                    <Fcards/>

                </div>








            </div>




        </div>
    )
}