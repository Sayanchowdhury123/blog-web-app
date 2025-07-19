
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import useAuthstore from "../store/authstore";

export default function Blogmanage() {
 const {logout,setshownav,user} = useAuthstore()
  const [text, settext] = useState("")











  return (
    <div className="h-screen  relative overflow-hidden">
      <Sidebar/>
      <div className="p-4 ">
          <div className="flex items-center justify-between " >
                <h1 className="text-4xl font-semibold"> Your Blogs</h1>
                <img src="jj" alt="img" className="w-8 h-8 bg-black rounded-full" onClick={setshownav}  />
            </div>

  
      </div>
      

    </div>
  )
}