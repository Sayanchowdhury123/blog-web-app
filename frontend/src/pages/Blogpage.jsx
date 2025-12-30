import api from "@/axios";
import Blog from "@/components/Blog";
import Loadingscrenn from "@/components/Loadingscreen";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import useAuthstore from "@/store/authstore";
import useProfilestore from "@/store/profilestore";
import { assign } from "lodash";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

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
  
  const [tags, settags] = useState([])



  const fb = async () => {

    try {
      setloading(true)
      const res = await api.get(`/blogs/${blogid}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      })
      settags(res.data.tags)

      setblog(res.data)


    } catch (error) {
      toast.error(error.response?.data?.msg || "Something went wrong");
    } finally {
      setloading(false)
    }
  }






  useEffect(() => {
    fb()

    
  }, [blogid])

  const trackview = async () => {
    try {
      const res = await api.post(`/writers/track-view/${blogid}`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      })
      seteid(res.data._id)
     
    } catch (error) {
      toast.error(error.response?.data?.msg || "Something went wrong");
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
      toast.error(error.response?.data?.msg || "Something went wrong");
    }
  }

  useEffect(() => {
    trackview()

  }, [blogid])


  const handleExit = () => {
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
    <div className="relative overflow-x-hidden">
      <Sidebar />
      <div className=" ">
        <Navbar />

        <Blog blog={blog} />

      </div>

      

    </div>
  )
}