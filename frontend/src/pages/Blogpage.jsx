import api from "@/axios";
import Blog from "@/components/Blog";
import Loadingscrenn from "@/components/Loadingscreen";
import Navbar from "@/components/Navbar";
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
       <Navbar/>

        <Blog blog={blog} />

      </div>

    </div>
  )
}