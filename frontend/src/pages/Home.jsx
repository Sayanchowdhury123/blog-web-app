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


export default function Home() {
    const { logout, setshownav, user, shownav } = useAuthstore()
    const{fetchinfo,h,fetcht, trendingblogs,fetchpa,pa} = useHomestore();
     const {userinfo,fetchuser} = useProfilestore()
    const[width,setwidth] = useState(window.innerWidth)

    useEffect(() => {
     const handlesize = () => setwidth(window.innerWidth)
     window.addEventListener("resize",handlesize)

     return () => window.removeEventListener("resize",handlesize)
    },[])


     const [loading, setloading] = useState(false)
      const navigate = useNavigate()
    
        const fetchl = async () => {
        setloading(true)
        try {
            await fetchinfo()
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        fetchl()
        fetchuser()
        fetcht()
        fetchpa()
    }, [])


if(loading) return <Loadingscrenn/>
    return (

        <div className="  relative bg-base-100 ">
            <Sidebar />

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


             

              
                 <div className="relative">
                    {
                        width >= 1528 && (
                           <Trending/>
                        )
                    }

                    {
                        width >= 1528 && (
                            <Pa/>
                        )
                    }

                    {
                        width >= 1528 && (
                            <Recom/>
                        )
                    }
                  
                    <Homecards/>
                </div>
               
              
                
               
            
               
             

            </div>




        </div>
    )
}