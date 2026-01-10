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



  const getrelated = async () => {
    try {


      const tags = JSON.stringify(blog.tags);


      const res = await api.get(`/blogs/related/${blog._id}/r?tags=${tags}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })

      setrelated(res.data)

    } catch (error) {

      toast.error(error?.response?.data?.message || "Something went wrong");
    }


  }


  useEffect(() => {
    if (blog?._id && blog?.tags) {
      getrelated();
    }
  }, [blog._id])


  const getexcerpt = (text, wordlimit = 50) => {
    const words = text?.trim().split(/\s+/)
    if (words.length <= wordlimit) {

      return text
    } else {
      return words.slice(0, wordlimit).join(" ") + "..."
    }
  }

  const getexcerpt2 = (html, wordLimit = 50) => {
    if (!html) return "";

    // Convert HTML → plain text
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";

    const words = text.trim().split(/\s+/);

    if (words.length <= wordLimit) {
      return text;
    }

    return words.slice(0, wordLimit).join(" ") + "...";
  };


  return (
    // <div>


    //   <div className="  ">


    //     <motion.div className=" bg-base-100 sm:w-5xl w-[400px] mx-auto mt-4 p-6 shadow-lg rounded-xl  space-y-6 " initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    //       <div className=" ">
    //         <div className="text-center">
    //           {/* {blog?.title?.length > 34 ? (<h1 className="text-4xl  font-bold" >{blog.title?.slice(0, 34) + "..."}</h1>) : (<h1 className="text-4xl  font-bold" >{blog.title}</h1>)} */}
    //           {/* <h1 className="text-4xl  font-bold">{blog?.title}</h1> */}
    //           <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
    //             {blog?.title}
    //           </h1>

    //           <div className="relative w-full">
    //             <div className="absolute -bottom-1 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent dark:from-base-100 pointer-events-none"></div>
    //           </div>

    //           <div className=" flex gap-4 items-center mt-2 justify-center">
    //             <div>
    //               <p>By <span className="font-semibold text-md">{blog?.creator?.name}</span> </p>
    //             </div>


    //             <div>
    //               {user?.role === "writer" || "editor" ? (
    //                 <div>
    //                   {blog?.approval === true ? <p className="badge badge-neutral p-3 " >Approved</p> : <p className="badge badge-neutral p-3 " >Rejected</p>}
    //                 </div>
    //               ) : ""}

    //             </div>



    //           </div>
    //           <div className="">
    //             <p className="text-sm">{new Date(blog?.createdAt).toLocaleDateString()}</p>
    //           </div>

    //         </div>


    //       </div>


    //       <div className="sm:w-3xl w-[300px] mx-auto ">
    //         <img src={blog?.coverimage} alt="coverimage" loading="lazy" className="  rounded-xl " />
    //       </div>

    //       <div dangerouslySetInnerHTML={{
    //         __html: blog?.blogtext
    //       }} className=" prose max-w-none cursor-pointer sm:w-full w-[300px] mx-auto text-center" >


    //       </div>

    //       <div>

    //       </div>

    //       <div className="flex flex-wrap gap-2 ml-[20px]" >
    //         {
    //           blog?.tags?.map((t, i) => (
    //             <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center badge badge-neutral gap-1 px-2 py-1 cursor-pointer">
    //               <p>#{t}</p>

    //             </motion.div>
    //           ))
    //         }
    //       </div>
    //     </motion.div>
    //   </div>

    //   <div className="mt-5 max-w-5xl mx-auto p-4">
    //     <h1 className="text-xl font-bold px-4 flex items-center gap-2">
    //       Related Blogs
    //     </h1>

    //     <motion.div
    //       className="flex gap-4 mt-5 overflow-x-auto whitespace-nowrap"
    //       style={{ scrollbarWidth: "none" }}
    //     >
    //       {related?.map((b, i) => (
    //         <motion.div key={b?._id}
    //           whileTap={{ scale: 0.95 }}
    //           initial={{ opacity: 0, y: 30 }}
    //           animate={{ opacity: 1, y: 0 }}
    //           transition={{ delay: i * 0.1, duration: 0.3 }} onClick={() => navigate(`/blog/${b?._id}`, {
    //             state: { blogid: b?._id }
    //           })}
    //           className="relative card bg-base-100 w-[399px] h-[265px] shadow-sm flex-shrink-0 overflow-hidden cursor-pointer"
    //         >

    //           <img
    //             src={b?.coverimage}
    //             alt={b?.title}
    //             className="absolute inset-0 w-full h-full object-cover"
    //           />


    //           <div className="absolute inset-0 bg-black/80"></div>


    //           <div className="relative card-body text-white">
    //             <h1 className="card-title whitespace-normal">{b?.title}</h1>


    //           </div>
    //         </motion.div>

    //       ))}
    //     </motion.div>
    //   </div>

    // </div>

    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6">

        <motion.div
          className="bg-base-100 shadow-lg rounded-xl p-6 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              {blog?.title}
            </h1>

            <div className="relative w-full mt-2">
              <div className="absolute -bottom-1 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent dark:from-base-100 pointer-events-none"></div>
            </div>


            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <p onClick={(e) => {
                e.stopPropagation()
                navigate(`/f-page/${blog?.creator?._id}`)

              }}>
                By <span className="font-semibold">{blog?.creator?.name}</span>
              </p>

              {(user?.role === "writer" || user?.role === "editor") && (
                <span className={`badge ${blog?.approval ? "badge-success" : "badge-error"}`}>
                  {blog?.approval ? "Approved" : "Rejected"}
                </span>
              )}
            </div>


            <p className="text-sm text-gray-500 mt-2">
              {new Date(blog?.createdAt).toLocaleDateString()}
            </p>
          </div>


          <div className="mx-auto max-w-2xl">
            <img
              src={blog?.coverimage}
              alt="Cover"
              loading="lazy"
              className="w-full rounded-xl object-cover"
            />
          </div>


          <div
            dangerouslySetInnerHTML={{ __html: blog?.blogtext }}
            className="prose prose-invert max-w-none mx-auto text-left"
          />


          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {blog?.tags?.map((t, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="badge badge-neutral cursor-pointer"
              >
                #{t}
              </motion.span>
            ))}
          </div>
        </motion.div>


        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Related Blogs</h2>


          <div className="flex overflow-x-auto pb-4 -mx-2 hide-scrollbar">
            {related?.map((b, i) => (
              <motion.div
                key={b?._id}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                onClick={() => navigate(`/blog/${b?._id}`, { state: { blogid: b?._id } })}
                className="flex-shrink-0 w-[328px] sm:w-[320px] mx-2 card bg-base-100 h-[220px] shadow-sm rounded-xl overflow-hidden cursor-pointer relative"
              >
                <img
                  src={b?.coverimage}
                  alt={b?.title}
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className="absolute inset-0 bg-black/70"></div>
                <div className="relative card-body text-white p-4">
                  <h3 className="card-title line-clamp-2 text-white">{b?.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>

  )
}