import Card from "@/components/Card"
import Loadingscrenn from "@/components/Loadingscreen"
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
   fetchuser()
   },[])

   if(loading) return <Loadingscrenn/>

    return(

         <div className="relative">
              <Sidebar />
        
              <div className=" space-y-6 ">
        
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
        
        
        
                <div>
                  <h1 className="text-3xl text-center font-semibold">Saved Blogs</h1>
                </div>
        
                <Card type="savedblogs" />
              
               
              </div>
            </div>
    )
}