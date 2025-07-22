
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import useAuthstore from "../store/authstore";
import api from "../axios";
import { useEffect } from "react";
import Loadingscrenn from "../components/Loadingscreen";

export default function Blogmanage() {
  const { logout, setshownav, user } = useAuthstore()
  const [text, settext] = useState("")
  const [loading, setloading] = useState(false)
  const [blogs, setblogs] = useState([])

  const fb = async () => {
    setloading(true)
    try {
      const res = await api.get("/blogs", {
        headers: {
          Authorization: `Bearer ${user.token}`,
         

        }
      })
      setblogs(res.data)
      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false)
    }
  }

  useEffect(() => {
    fb()
  }, [])








  if (loading) <Loadingscrenn />
  return (
    <div className="h-screen  relative overflow-x-hidden">
      <Sidebar />
      <div className="p-4 ">
        <div className="flex items-center justify-between " >
          <h1 className="text-4xl font-semibold"> Your Blogs</h1>
          <img src="jj" alt="img" className="w-8 h-8 bg-black rounded-full" onClick={setshownav} />
        </div>


      </div>


    </div>
  )
}