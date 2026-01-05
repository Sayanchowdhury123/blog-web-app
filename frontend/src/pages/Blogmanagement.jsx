
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
import Navbar from "@/components/Navbar";
import { AiFillDelete } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import { MdContentPasteGo } from "react-icons/md";
import ErrorButton from "@/components/Errorbutton";



export default function Blogmanage() {
  const { logout, setshownav, user, setshowalert, showalert, blogid, setblogid, setshowedit, showedit } = useAuthstore()
  const [text, settext] = useState("")
  const [loading, setloading] = useState(false)
  const [blogs, setblogs] = useState([])
  const [l, setl] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { fetchuser, userinfo } = useProfilestore()
  const { setubox, ubox, setroomid } = useBlogmstore()

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
      toast.error(error.response?.data?.msg || "Something went wrong");
    } finally {
      setloading(false)
    }
  }

  useEffect(() => {
    fb()


  }, [])



  const delblog = async () => {
    setl(true)
    try {
      const res = api.delete(`/blogs/${blogid}/del-blog`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      })

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

  const getexcerpt = (text, wordlimit = 20) => {
    const words = text?.trim().split(/\s+/)
    if (words.length <= wordlimit) {
      return text
    } else {
      return words.slice(0, wordlimit).join(" ") + "..."
    }
  }


  if (loading) return <Loadingscrenn />
  return (
    <div className="min-h-screen  relative overflow-x-hidden">


      {
        l && (
          <Loading2 />
        )
      }

      <Sidebar />
      <div className=" ">

        <Navbar />



        <div className="mt-[50px] mb-[20px]">
          <h1 className="text-3xl text-center font-semibold">Your Blogs</h1>
        </div>

        {showalert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <Alert del={delblog} />
          </div>
        )}

        {
          showedit && (
            <div className="fixed backdrop-blur-sm z-20 inset-0 flex justify-center items-center ">
              <Editblog fb={fb} />
            </div>
          )
        }

        {
          ubox && (
            <Au />
          )
        }

        <div >

          {
            blogs?.length > 0 ? (
              <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4" >
                {
                  blogs?.map((b, i) => (
                    //       <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.9 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} className="card bg-base-100  image-full  shadow-sm min-h-[300px] " key={b._id} >
                    //         <figure>
                    //           <img
                    //             src={`${b?.coverimage}`}
                    //             alt={b?.title} />
                    //         </figure>
                    //         <div className="card-body ">
                    //           <h2 className="card-title ">{b?.title}</h2>

                    //           <div dangerouslySetInnerHTML={{
                    //             __html: getexcerpt(b.blogtext)
                    //           }} className="prose max-w-none cursor-pointer " onClick={() => navigate(`/blog/${b._id}`, {
                    //             state: { blogid: b._id }
                    //           })}>

                    //           </div>
                    //           <p></p>
                    //           <div className="card-actions ">

                    //             <button className="btn tooltip" data-tip="collaboration" da="true" onClick={() => {
                    //               setubox()
                    //               setroomid(b)
                    //             }}><FcCollaboration /></button>
                    //             <button className="btn btn-success tooltip" data-tip="edit content" da="true" onClick={() => navigate(`/edit-content/${b._id}`, {
                    //               state: { t: b }
                    //             })}><MdContentPasteGo /></button>
                    //             <button className="btn btn-primary tooltip" data-tip="edit blog" da="true" onClick={() => setshowedit(b._id, b)}><MdOutlineEdit /></button>
                    //             <button className="btn btn-error tooltip" data-tip="delete blog" da="true" onClick={() => setshowalert(b._id)}><AiFillDelete /></button>

                    //           </div>
                    //         </div>
                    //       </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                      className="rounded-xl overflow-hidden relative card bg-base-100 h-[300px] text-white shadow-sm"
                      key={b?._id}
                    >
                     
                      <figure className="relative h-full w-full">
                        <img
                          src={b?.coverimage || ""}
                          alt={b?.title || "Cover"}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/70"></div>
                      </figure>

                     
                      <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                        
                        <div>
                          <h2 className="card-title text-white">{b?.title}</h2>
                        </div>

                        <div className="flex-grow overflow-hidden">
                          <div
                            dangerouslySetInnerHTML={{ __html: getexcerpt(b?.blogtext) }}
                            className="prose prose-invert max-w-none cursor-pointer line-clamp-3"
                            onClick={() => navigate(`/blog/${b?._id}`, { state: { blogid: b?._id } })}
                          ></div>
                        </div>

                     
                        <div className="card-actions flex justify-end gap-2 mt-2">
                          <button className="btn  tooltip" data-tip="Collab" onClick={() => { setubox(); setroomid(b); }}>
                            <FcCollaboration />
                          </button>
                          <button className="btn  btn-success tooltip" data-tip="Edit Content"
                            onClick={() => navigate(`/edit-content/${b._id}`, { state: { t: b } })}>
                            <MdContentPasteGo />
                          </button>
                          <button className="btn  btn-primary tooltip" data-tip="Edit Blog"
                            onClick={() => setshowedit(b._id, b)}>
                            <MdOutlineEdit />
                          </button>
                          <button className="btn  btn-error tooltip" data-tip="Delete"
                            onClick={() => setshowalert(b._id)}>
                            <AiFillDelete />
                          </button>
                        </div>
                      </div>
                    </motion.div>

                  ))

                }
              </motion.div>

            ) : (
              (
                <motion.div initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center h-[60vh]">
                  <div className="text-center bg-base-200 p-8 rounded-xl shadow-md max-w-sm w-full mx-auto">
                    <p className="text-lg font-semibold text-base-content mb-4">
                      ✍️ No Blogs Created Yet
                    </p>

                    <p className="text-sm text-gray-500 mb-6">
                      Start sharing your thoughts by creating your first blog.
                    </p>

                    <button
                      className="btn btn-primary w-full"
                      onClick={() => navigate("/create-blogs")}
                    >
                      Create Blog
                    </button>
                  </div>
                </motion.div>

              )
            )


          }
        </div>


      </div>


    </div>
  )
}