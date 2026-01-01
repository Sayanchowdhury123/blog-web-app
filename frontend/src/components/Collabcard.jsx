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


    const getexcerpt = (text, wordlimit = 50) => {
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



    const collabblogs = blogs?.filter((b) => b.collabrators?.includes(user.id))

    if (collabblogs?.length === 0) {
        return (
            <>
                <motion.div initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center h-[60vh]">
                    <div className="text-center bg-base-200 p-8 rounded-xl shadow-md max-w-sm w-full mx-auto">
                        <p className="text-lg font-semibold text-base-content ">
                            You Are Not Collabrating With Anyone
                        </p>


                    </div>
                </motion.div>

            </>
        )
    }


    return (
        <motion.div className={`grid grid-cols-1 ${savedpage ? "md:grid-cols-3" : "md:grid-cols-2"} gap-4 p-4 `} >

            {
                collabblogs?.map((b, i) => {



                    return (
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} className={`rounded-xl overflow-hidden relative   card bg-base-100 h-[400px] text-white  shadow-sm`} key={b._id} >
                            {
                                id === b._id && (
                                    <Loading2 />
                                )
                            }
                            <figure>
                                <img
                                    src={`${b.coverimage}`}
                                    alt="coverimages" className=" object-cover absolute inset-0" />
                            </figure>
                            <div className="absolute inset-0 bg-black/70"></div>
                            <div className="relative card-body">
                                <div className="flex justify-between items-center ">
                                    <div>
                                        <h2 className="card-title">{b?.title}</h2>
                                    </div>


                                </div>

                                {savedpage ? (
                                    <div dangerouslySetInnerHTML={{
                                        __html: getexcerpt(b.blogtext)
                                    }} className="prose max-w-none cursor-pointer" onClick={() => navigate(`/blog/${b._id}`, {
                                        state: { blogid: b._id }
                                    })} >

                                    </div>
                                ) : (
                                    <div dangerouslySetInnerHTML={{
                                        __html: getexcerpt(b.blogtext)
                                    }} className="prose max-w-none cursor-pointer"  >

                                    </div>
                                )}



                                <p></p>

                                <div className="card-actions justify-end">

                                    <button className="btn btn-sm" onClick={() => navigate(`/collab/${b._id}`, {
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