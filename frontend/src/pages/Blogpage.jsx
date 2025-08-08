import api from "@/axios";
import Blog from "@/components/Blog";
import Loadingscrenn from "@/components/Loadingscreen";
import Sidebar from "@/components/Sidebar";
import useAuthstore from "@/store/authstore";
import useProfilestore from "@/store/profilestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


export default function Blogpage() {
  const { setshownav } = useAuthstore()
  const [loading, setloading] = useState(false)
  const [blog, setblog] = useState([])
  const location = useLocation()
  const { blogid } = location.state || {};
  const { user } = useAuthstore()
  const navigate = useNavigate()
   const {fetchuser,userinfo} = useProfilestore()
  const fb = async () => {

    try {
      setloading(true)
      const res = await api.get(`/blogs/${blogid}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      })
      setblog(res.data)
      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false)
    }
  }


  useEffect(() => {
    fb()
    fetchuser()
  }, [])


  if (loading) return <Loadingscrenn />


  return (
    <div className="relative">
      <Sidebar />
      <div className=" ">
        <div className="flex items-center justify-between sticky top-0  shadow p-4 bg-white z-20 " onClick={(e) => {
          e.stopPropagation()
          setshownav
        }}>
          <h1 className="text-4xl font-bold" onClick={(e) => {
            e.stopPropagation()
            navigate("/home")
          }}>  BlogApp</h1>
          <img src={userinfo.profilepic} alt="img" className="w-8 h-8 bg-black rounded-full" />
        </div>

        <Blog blog={blog} />

      </div>

    </div>
  )
}