import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import useAuthstore from "../store/authstore"
import useEditorstore from "@/store/editorstore"
import { useEffect, useState } from "react"
import Card from "@/components/Card"
import Homecards from "@/components/Homecards"


export default function Home() {
    const { logout, setshownav, user, shownav } = useAuthstore()
    
    const {fetchall} = useEditorstore()
     const [loading, setloading] = useState(false)
      const navigate = useNavigate()
    
      const fetchl = async () => {
        setloading(true)
        try {
          await fetchall()
        } catch (error) {
          console.log(error);
        } finally {
          setloading(false)
        }
      }

      useEffect(() => {
        fetchl()
      },[])

    return (

        <div className="h-screen  relative ">
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
                    <img src="jj" alt="img" className="w-8 h-8 bg-black rounded-full" />
                </div>


                <div>
                     <h1 className="text-3xl text-center font-semibold">Explore Blogs</h1>
                </div>

               
               <Homecards/>
               

            </div>




        </div>
    )
}