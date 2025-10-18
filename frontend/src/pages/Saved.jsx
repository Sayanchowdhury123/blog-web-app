import Card from "@/components/Card"
import Loadingscrenn from "@/components/Loadingscreen"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import useAuthstore from "@/store/authstore"
import useProfilestore from "@/store/profilestore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


export default function Saved(){
    const navigate = useNavigate()
      const { setshownav, user } = useAuthstore()
  const [loading, setloading] = useState(false)
   const {fetchuser,userinfo} = useProfilestore()
  const { getsavedblogs,load,hasmore} = useProfilestore()

   const fetchl = async () => {
    setloading(true)
    try {
      await getsavedblogs()
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false)
    }
  }

   useEffect(() => {
    fetchl()

   },[])

   if(loading) return <Loadingscrenn/>

    return(

         <div className="relative">
              <Sidebar />
        
              <div className=" space-y-6 ">
        
              <Navbar/>
        
        
        
                <div>
                  <h1 className="text-3xl text-center font-semibold">Saved Blogs</h1>
                </div>
        
                <Card type="savedblogs" />
              
               
              </div>
            </div>
    )
}