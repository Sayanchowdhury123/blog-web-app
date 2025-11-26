import api from "@/axios";
import useAuthstore from "@/store/authstore";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion";
import Loadingscrenn from "./Loadingscreen";
import Loading2 from "./Loadin2";
import useProfilestore from "@/store/profilestore";



export default function Blog({ blog }) {
  const { user } = useAuthstore()
  const { fetchuser, userinfo } = useProfilestore()



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
      console.log(error);
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
      console.log(error);
    }
  }

  useEffect(() => {
    readhistory()
  }, [])



console.log(blog.blogtext);

  return (
    <div>


      <div className="  ">


        <motion.div className=" bg-base-100 sm:w-5xl w-[400px] mx-auto mt-4 p-6 shadow-lg rounded-xl  space-y-6 " initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className=" ">
            <div className="text-center">
              <h1 className="text-4xl  font-bold">{blog?.title}</h1>
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
    </div>

  )
}