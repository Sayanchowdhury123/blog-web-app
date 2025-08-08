import Editprofile from "@/components/Editprofile"
import Loadingscrenn from "@/components/Loadingscreen"
import Sidebar from "@/components/Sidebar"
import useAuthstore from "@/store/authstore"
import useProfilestore from "@/store/profilestore"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"


export default function Userprofile() {
    const [loading, setloading] = useState(false)
    const { fetchuser, userinfo, setshowedit, showedit } = useProfilestore()

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

        <motion.div className="relative">
            <Sidebar />

            {
                showedit && (
                    <div className="absolute backdrop-blur-sm z-20 inset-0 flex justify-center items-center ">
                        <Editprofile />
                    </div>
                )
            }



            <div className="space-y-6">

                <div className="flex items-center justify-between sticky top-0  shadow p-4 bg-white z-20 " onClick={(e) => {
                    e.stopPropagation()
                    setshownav
                }}>
                    <h1 className="text-4xl font-bold cursor-pointer" onClick={(e) => {
                        e.stopPropagation()
                        navigate("/home")
                    }}>  BlogApp</h1>
                    <img src={userinfo.profilepic} alt="img" className="w-8 h-8 bg-black rounded-full" />
                </div>

                <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className=" flex justify-center items-center">
                    <div className=" bg-base-300 p-6 shadow-lg rounded-xl  w-sm sm:w-md md:w-3xl flex justify-center items-center gap-4">

                        <div className=" text-center space-y-2 ">
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