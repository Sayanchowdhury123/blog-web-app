import useAuthstore from "@/store/authstore";
import useEditorstore from "@/store/editorstore";
import { motion } from "framer-motion"
import { useEffect, useState } from "react";
import Loadingscrenn from "./Loadingscreen";
import { useNavigate } from "react-router-dom";
import Loading2 from "./Loadin2";
import toast from "react-hot-toast"
import { FcApprove } from "react-icons/fc";
import { FcDisapprove } from "react-icons/fc";
import { MdEdit } from "react-icons/md";
import { MdOutlinePreview } from "react-icons/md";
import useProfilestore from "@/store/profilestore";
import { IoMdRemoveCircle } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { IoCheckmarkCircleOutline, IoCheckmarkCircleSharp } from "react-icons/io5";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import useBlogmstore from "@/store/Blogm";
import api from "@/axios";

export default function Collabcard({ type }) {
    const { fetchall, blogs, approveblog, bid, setbid, bloginfo, epblog, notjoin } = useEditorstore();
    const { setshownav, user } = useAuthstore()
    const [loading, setloading] = useState(false)
    const [id, setid] = useState(null)
    const navigate = useNavigate()
    const { savedblogs, tblog } = useProfilestore()
    const savedpage = type === "savedblogs";


    const getexcerpt = (text, wordlimit = 20) => {
        const words = text?.trim().split(/\s+/)
        if (words?.length <= wordlimit) {
            return text
        } else {
            return words?.slice(0, wordlimit).join(" ") + "..."
        }
    }

    const ab = async (blogid) => {
        setid(blogid)
        try {
            if (savedpage) {
                await tblog(blogid)
                toast("Blog Removed",
                    {
                        icon: '🎉',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    })

            } else {
                await approveblog(blogid)
                toast(`${bloginfo?.approval ? "Blog Disapproved" : "Blog Approved"}`,
                    {
                        icon: '🎉',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    })
            }


        } catch (error) {

            toast('Status upation failed',
                {
                    icon: '❌',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                })
        } finally {
            setid(null)

        }
    }

    const pickep = async (blogid) => {
        setid(blogid)
        try {
            if (savedpage) {
                await tblog(blogid)
                toast("Blog Removed",
                    {
                        icon: '🎉',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    })

            } else {
                await epblog(blogid)
                toast(`${bloginfo?.ep ? "Blog Unpicked" : "Blog Picked"}`,
                    {
                        icon: '🎉',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    })
            }


        } catch (error) {

            toast('Action failed',
                {
                    icon: '❌',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                })
        } finally {
            setid(null)

        }
    }

   const getexcerpt2 = (text, wordlimit = 20) => {
    const words = text?.trim().split(/\s+/)
    if (words.length <= wordlimit) {
      return text
    } else {
      return words.slice(0, wordlimit).join(" ") + "..."
    }
  }

    const collabblogs = blogs?.filter((b) => b.collabrators?.includes(user.id))

    if (collabblogs?.length === 0) {
        return (
            <>
                <motion.div initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center h-[60vh]">
                    <div className="text-center bg-base-200 p-8 rounded-xl shadow-md max-w-sm w-full mx-auto">
                        <p className="text-lg font-semibold text-base-content mb-2">
                            You Are Not Collabrating With Anyone
                        </p>

                        <p className="text-sm text-gray-500 mb-4">
                            Click On Start Collaboration For Blog Collab

                        </p>


                        <button
                            className="btn btn-primary w-full"
                            onClick={() => navigate("/yourblogs")}
                        >
                            Start Collaboration
                        </button>
                    </div>
                </motion.div>

            </>
        )
    }


   


    return (
        <motion.div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 `} >

            {
                collabblogs?.map((b, i) => {



                    return (
                        // <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} className={`rounded-xl overflow-hidden relative   card bg-base-100 h-[400px] text-white  shadow-sm`} key={b._id} >
                        //     {
                        //         id === b._id && (
                        //             <Loading2 />
                        //         )
                        //     }
                        //     <figure>
                        //         <img
                        //             src={`${b.coverimage}`}
                        //             alt="coverimages" className=" object-cover absolute inset-0" />
                        //     </figure>
                        //     <div className="absolute inset-0 bg-black/70"></div>
                        //     <div className="relative card-body">
                        //         <div className="flex justify-between items-center ">
                        //             <div>
                        //                 <h2 className="card-title">{b?.title}</h2>
                        //             </div>


                        //         </div>

                        //         {savedpage ? (
                        //             <div dangerouslySetInnerHTML={{
                        //                 __html: getexcerpt(b.blogtext)
                        //             }} className="prose max-w-none cursor-pointer" onClick={() => navigate(`/blog/${b._id}`, {
                        //                 state: { blogid: b._id }
                        //             })} >

                        //             </div>
                        //         ) : (
                        //             <div dangerouslySetInnerHTML={{
                        //                 __html: getexcerpt(b.blogtext)
                        //             }} className="prose max-w-none cursor-pointer"  >

                        //             </div>
                        //         )}



                        //         <p></p>



                        //     </div>
                        // </motion.div>

                        // <motion.div
                        //     initial={{ opacity: 0, y: 30 }}
                        //     animate={{ opacity: 1, y: 0 }}
                        //     transition={{ delay: i * 0.1, duration: 0.3 }}
                        //     className={`rounded-xl overflow-hidden relative card  bg-base-100 h-[300px] text-white shadow-sm`}
                        //     key={b?._id}
                        // >
                        //     {id === b?._id && <Loading2 />}

                        //     <figure className="relative h-full w-full ">
                        //         <img
                        //             src={b?.coverimage || ""}
                        //             alt={b?.title || "Cover"}
                        //             loading="lazy"
                        //             className="w-full h-full object-cover"

                        //         />
                        //         <div className="absolute inset-0 bg-black/70"></div>
                        //     </figure>

                        //     <div className="absolute inset-0 flex flex-col justify-between p-4 z-10  ">
                        //         <div className="">
                        //             <h2 className="card-title text-white">{b?.title}</h2>
                        //         </div>
                        //         <div className="flex-grow overflow-hidden">
                        //             <div
                        //                 dangerouslySetInnerHTML={{ __html: getexcerpt(b?.blogtext) }}
                        //                 className="prose prose-invert max-w-none cursor-pointer line-clamp-3"
                        //                 onClick={() => navigate(`/blog/${b?._id}`, { state: { blogid: b?._id } })}
                        //             ></div>

                        //         </div>

                        //         <div className="card-actions flex justify-end gap-2 mt-2">

                        //             <button className="btn btn-sm" onClick={() => navigate(`/collab/${b?._id}`, {
                        //                 state: { t: b }
                        //             })}><MdOutlineConnectWithoutContact />Join</button>


                        //             <button className="btn btn-sm btn-error" onClick={() => notjoin(b)}><MdCancel />Cancel</button>
                        //         </div>

                        //     </div>



                        // </motion.div>


                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.3 }}
                            className="rounded-xl overflow-hidden relative card bg-base-100 h-[300px] text-white shadow-sm"
                            key={b?._id}
                        >

                            {id === b?._id && <Loading2 />}

                            <figure className="relative h-full w-full">
                                <img
                                    src={b?.coverimage || ""}
                                    alt={b?.title || "Cover"}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                      onClick={() => navigate(`/blog/${b?._id}`, { state: { blogid: b?._id } })}
                                />
                                <div className="absolute inset-0 bg-black/70"></div>
                            </figure>


                            <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">

                                <div>
                                    <h2 className="card-title text-white">{b?.title}</h2>
                                </div>

                                {/* <div className="flex-grow overflow-hidden">
                                    <div
                                        dangerouslySetInnerHTML={{ __html: getexcerpt2(b?.blogtext) }}
                                        className="prose prose-invert max-w-none cursor-pointer line-clamp-3"
                                        onClick={() => navigate(`/blog/${b?._id}`, { state: { blogid: b?._id } })}
                                    ></div>
                                </div> */}


                                <div className="card-actions flex justify-end gap-2 mb-2">
                                    <button className="btn btn-sm" onClick={() => navigate(`/collab/${b?._id}`, {
                                        state: { t: b }
                                    })}><MdOutlineConnectWithoutContact />Join</button>


                                    <button className="btn btn-sm btn-error" onClick={() => notjoin(b)}><MdCancel />Cancel</button>
                                </div>
                            </div>
                        </motion.div>

                    )
                }




                )
            }
        </motion.div>

    )
}