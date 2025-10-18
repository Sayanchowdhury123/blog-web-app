import Editprofile from "@/components/Editprofile"
import Loadingscrenn from "@/components/Loadingscreen"
import Po from "@/components/Po"
import Sidebar from "@/components/Sidebar"
import useAuthstore from "@/store/authstore"
import useProfilestore from "@/store/profilestore"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { IoMdSettings } from "react-icons/io";
import { FaUserCog } from "react-icons/fa";
import Navbar from "@/components/Navbar"


export default function Userprofile() {
    const [loading, setloading] = useState(false)
    const { fetchuser, userinfo, setshowedit, showedit ,setboxopen,boxopen,load} = useProfilestore()

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

  

    if (loading) return <Loadingscrenn />
    if(load) return <Loadingscrenn type="ep"/>

    return (

        <motion.div className="relative">
            <Sidebar />

            {
                showedit && (
                    <div className="absolute backdrop-blur-sm z-20 inset-0 flex justify-center items-center ">
                        <Editprofile />
                    </div>
                )
            }

            {
                boxopen && (
                    <Po/>
                )
            }



            <div className="space-y-6">

                <Navbar/>

                <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className=" flex justify-center items-center">
                
                    <div className="  p-6 shadow-lg rounded-xl  w-sm sm:w-md md:w-3xl ">
                            
                         <div className="flex justify-end">
                         <FaUserCog onClick={setboxopen} />
                        </div>
                        <div className=" text-center space-y-2 flex flex-col items-center gap-2">
                            <img src={userinfo.profilepic} alt="profile picture" className="w-64 rounded-full" />
                        
                            <p className="text-3xl font-semibold ">{userinfo.name}</p>
                            <p className="text-sm ">{userinfo.email}</p>
                            <button onClick={setshowedit} className="btn btn-accent">Edit Profile</button>
                       </div>
                    </div>
                </motion.div>


            </div>





        </motion.div>
    )
}