import api from "@/axios";
import Blog from "@/components/Blog";
import Loadingscrenn from "@/components/Loadingscreen";
import Sidebar from "@/components/Sidebar";
import useAuthstore from "@/store/authstore";
import useProfilestore from "@/store/profilestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";


export default function Blogpage() {
  const { setshownav } = useAuthstore()
  const [loading, setloading] = useState(false)
  const [blog, setblog] = useState([])

  const { blogid } = useParams();
  const { user } = useAuthstore()
  const navigate = useNavigate()
  const [viewed, setviewed] = useState(false)
  const { fetchuser, userinfo } = useProfilestore()
  const [eid, seteid] = useState("")


  const fb = async () => {

    try {
      setloading(true)
      const res = await api.get(`/blogs/${blogid}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      })
      setblog(res.data)


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

  const trackview = async () => {
    try {
      const res = await api.post(`/writers/track-view/${blogid}`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      })
       seteid(res.data._id)
      
    } catch (error) {
      console.log(error);
    }
  }

    let entryid;
  const tryackentry = async () => {
    try {
      const res = await api.post(`/writers/entry/${blogid}`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      })

     
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    trackview()
  }, [blogid])


const handleExit =  () => {
    if (eid) {

     api.post(`/writers/exit/${eid}`, { exitat: Date.now() });
    }
  };


useEffect(() => {
  
    
  window.addEventListener("pagehide", handleExit);

  return () => {
    handleExit()
    window.removeEventListener("pagehide", handleExit);
  };
}, [eid]);



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