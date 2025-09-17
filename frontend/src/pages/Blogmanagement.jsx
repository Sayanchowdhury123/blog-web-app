
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import useAuthstore from "../store/authstore";
import api from "../axios";
import { useEffect } from "react";
import Loadingscrenn from "../components/Loadingscreen";
import { motion } from "framer-motion";
import Alert from "../components/Alert";
import toast from "react-hot-toast";
import Loading2 from "../components/Loadin2";
import Editblog from "../components/Editblog";
import { useLocation, useNavigate } from "react-router-dom";
import useProfilestore from "@/store/profilestore";
import { FcCollaboration } from "react-icons/fc";
import useBlogmstore from "@/store/Blogm";
import Au from "@/components/Au";


export default function Blogmanage() {
  const { logout, setshownav, user, setshowalert, showalert, blogid, setblogid,setshowedit,showedit } = useAuthstore()
  const [text, settext] = useState("")
  const [loading, setloading] = useState(false)
  const [blogs, setblogs] = useState([])
  const [l, setl] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const {fetchuser,userinfo} = useProfilestore()
  const {setubox,ubox,setroomid} = useBlogmstore()

  const fb = async () => {
  
    try {
       setloading(true)
      const res = await api.get("/blogs", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      })
      setblogs(res.data)

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

 

  const delblog = async () => {
    setl(true)
    try {
      const res = api.delete(`/blogs/${blogid}/del-blog`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      })
      console.log((await res).data);
      setblogs((prev) => prev.filter(b => b._id !== blogid))
      toast('Blog deleted',
        {
          icon: '🎉',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        })
      setshowalert()
      setblogid()

    } catch (error) {
      console.log(error);
      toast('Blog deletion failed',
        {
          icon: '❌',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        })
    } finally {
      setl(false)
    }
  }
  
  const getexcerpt = (text,wordlimit=50) => {
    const words = text?.trim().split(/\s+/)
    if(words.length <= wordlimit){
      return text
    }else{
      return words.slice(0,wordlimit).join(" ") + "..."
    }
  }


  if(loading)  return <Loadingscrenn />
  return (
    <div className="h-screen  relative overflow-x-hidden">
      

      {
        l && (
          <Loading2 />
        )
      }

      <Sidebar />
      <div className=" space-y-6 ">
       
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



        <div>
          <h1 className="text-3xl text-center font-semibold">Your Blogs</h1>
        </div>
        {showalert && (
          <div className="absolute backdrop-blur-sm z-20 inset-0 flex justify-center items-center">
            <Alert del={delblog} />
          </div>

        )}

        {
          showedit && (
            <div className="absolute backdrop-blur-sm z-20 inset-0 flex justify-center items-center">
              <Editblog fb={fb} />
             </div>
          )
        }

       {
        ubox && (
          <Au/>
        )
       }

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4" >
          {
            blogs?.map((b, i) => (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{scale:0.9}} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} className="card bg-base-100  image-full  shadow-sm" key={b._id} >
                <figure>
                  <img
                    src={`${b.coverimage}`}
                    alt="Shoes" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{b?.title}</h2>
                  
                  <div dangerouslySetInnerHTML={{
                    __html: getexcerpt(b.blogtext)
                  }} className="prose max-w-none cursor-pointer" onClick={() => navigate(`/blog/${b._id}`,{
                    state: {blogid: b._id}
                  })}>
                    
                    </div>
                    <p></p>
                  <div className="card-actions justify-end">
                  
                     <button className="btn" onClick={() => {
                      setubox()
                      setroomid(b)
                    }}><FcCollaboration/></button>
                    <button className="btn btn-success" onClick={() => navigate(`/edit-content/${b._id}`,{
                      state: {t: b}
                    })}>Edit Content</button>
                    <button className="btn btn-primary" onClick={() => setshowedit(b._id,b)}>Edit Blog</button>
                    <button className="btn btn-error" onClick={() => setshowalert(b._id)}>Delete Blog</button>

                  </div>
                </div>
              </motion.div>
            ))
          }
        </motion.div>


      </div>


    </div>
  )
}