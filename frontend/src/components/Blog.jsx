import api from "@/axios";
import useAuthstore from "@/store/authstore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion";
import Loadingscrenn from "./Loadingscreen";
import Loading2 from "./Loadin2";
import useProfilestore from "@/store/profilestore";
import toast from "react-hot-toast";



export default function Blog({ blog }) {
  const { user } = useAuthstore()
  const { fetchuser, userinfo } = useProfilestore()
const [related, setrelated] = useState([])
const navigate = useNavigate()

  const addview = async () => {
    try {
      if (blog._id && user) {
        const res = await api.patch(`/blogs/${blog?._id}/add-view/${user.id}`, {}, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          }
        })
      }


    } catch (error) {
       toast.error(error.response?.data?.msg || "Something went wrong");
    }
  }

  useEffect(() => {

    if (user?.id && blog?._id) {
      addview()
    }

  }, [blog._id, user?._id])

  const readhistory = async () => {
    try {

      if (blog?.tags) {
        const res = await api.patch(`/profile/${user.id}/readh`, { blogid: blog?._id, tags: blog?.tags }, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          }
        })


      }



    } catch (error) {
       toast.error(error.response?.data?.msg || "Something went wrong");
    }
  }

  useEffect(() => {
    readhistory()
  }, [])

const getexcerpt = (text, wordlimit = 50) => {
    const words = text?.trim().split(/\s+/)
    if (words.length <= wordlimit) {
      return text
    } else {
      return words.slice(0, wordlimit).join(" ") + "..."
    }
  }

  const getrelated = async () => {
    try {
      

      const tags = JSON.stringify(blog.tags);
     
      if (!tags) {
        toast.error(error.response?.data?.msg || "Something went wrong");
      }

      const res = await api.get(`/blogs/related/${blog._id}/r?tags=${tags}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })

      setrelated(res.data)

    } catch (error) {
      toast.error(error.response?.data?.msg || "Something went wrong");
    } 
      
    
  }


  useEffect(() => {
    getrelated()
  },[blog._id])


  return (
    <div>


      <div className="  ">


        <motion.div className=" bg-base-100 sm:w-5xl w-[400px] mx-auto mt-4 p-6 shadow-lg rounded-xl  space-y-6 " initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className=" ">
            <div className="text-center">
              {blog?.title?.length > 34 ? (<h1 className="text-4xl  font-bold" >{blog.title?.slice(0,34) + "..."}</h1>) : (<h1 className="text-4xl  font-bold" >{blog.title}</h1>)}
              {/* <h1 className="text-4xl  font-bold">{blog?.title}</h1> */}
              <div className=" flex gap-4 items-center mt-2 justify-center">
                <div>
                  <p>By <span className="font-semibold text-md">{blog?.creator?.name}</span> </p>
                </div>


                <div>
                  {user?.role === "writer" || "editor" ? (
                    <div>
                      {blog?.approval === true ? <p className="badge badge-neutral p-3 " >Approved</p> : <p className="badge badge-neutral p-3 " >Rejected</p>}
                    </div>
                  ) : ""}

                </div>



              </div>
              <div className="">
                <p className="text-sm">{new Date(blog?.createdAt).toLocaleDateString()}</p>
              </div>

            </div>


          </div>


          <div className="sm:w-3xl w-[300px] mx-auto ">
            <img src={blog?.coverimage} alt="coverimage" className="  rounded-xl " />
          </div>

          <div dangerouslySetInnerHTML={{
            __html: blog?.blogtext
          }} className=" prose max-w-none cursor-pointer sm:w-full w-[300px] mx-auto text-center" >


          </div>

          <div>

          </div>

          <div className="flex flex-wrap gap-2 ml-[20px]" >
            {
              blog?.tags?.map((t, i) => (
                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center badge badge-neutral gap-1 px-2 py-1 cursor-pointer">
                  <p>#{t}</p>

                </motion.div>
              ))
            }
          </div>
        </motion.div>
      </div>

      <div className="mt-5 w-5xl mx-auto  " style={{scrollbarWidth:"none"}}>
         <h1 className="text-xl font-bold px-4 flex items-center gap-2 ">Related Blogs</h1>
        <motion.div className="flex items-center  gap-4 mt-5 overflow-x-hidden" style={{scrollbarWidth:"none"}}>
          {
            related?.map((b, i) => (
              <motion.div  whileTap={{ scale: 0.9 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} className="card bg-base-100 w-[399px] h-[265px] image-full  shadow-sm" key={b._id} >
                <figure>
                  <img
                    src={`${b.coverimage}`}
                    alt="Shoes" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{b?.title}</h2>

                  <div dangerouslySetInnerHTML={{
                    __html: getexcerpt(b.blogtext)
                  }} className="prose max-w-none cursor-pointer" onClick={() => navigate(`/blog/${b._id}`, {
                    state: { blogid: b._id }
                  })}>

                  </div>
                  <p></p>

                </div>
              </motion.div>
            ))
          }
        </motion.div>
      </div>
    </div>

  )
}