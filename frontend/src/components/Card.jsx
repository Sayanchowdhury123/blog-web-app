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
import api from "@/axios";
import { socket } from "@/services/Socketp";
import { MdOutlineReviews } from "react-icons/md";

export default function Card({ type }) {
    const { fetchall, blogs, approveblog, bid, setbid, bloginfo, epblog } = useEditorstore();
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


    const createnotification = async (blogtitle, creator, blogid) => {
        try {
            if (blogtitle && creator) {
                const res = await api.post(`/notify/ban`, { blogtitle, creator, blogid }, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })


            }

            socket.emit("sendNotification", {
                user: creator,
                message: `🎉 Your blog ${blogtitle} has been approved!`,
                link: `/blog/${blogid}`,
                read: false,
                type: "approval",
                senderid: user?.id
            })


        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong");
        }
    }


    const brn = async (blogtitle, creator, blogid) => {
        try {
            if (blogtitle && creator) {
                const res = await api.post(`/notify/brn`, { blogtitle, creator, blogid }, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })


            }

            socket.emit("sendNotification", {
                user: creator,
                message: ` ❌ Your blog ${blogtitle} has been rejected.`,
                link: `/blog/${blogid}`,
                read: false,
                type: "rejection",
                senderid: user?.id
            })



        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong");
        }
    }

    const ab = async (blogid, blogtitle, creator) => {
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

                if (bloginfo?.approval === false ? await createnotification(blogtitle, creator, blogid) : await brn(blogtitle, creator, blogid))
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

    const list = savedpage ? savedblogs : blogs;

    if (!list || list.length === 0 && savedpage) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }} className="flex items-center justify-center h-[60vh]">
                <div className="text-center bg-base-200 p-8 rounded-xl shadow-md max-w-sm w-full">
                    <p className="text-lg font-semibold mb-2">
                        🔖 No Saved Blogs
                    </p>

                    <p className="text-sm text-gray-500 mb-6">
                        You haven’t saved any blogs yet.

                    </p>


                    <button
                        className="btn btn-primary w-full"
                        onClick={() => navigate("/home")}
                    >
                        Explore Blog
                    </button>

                </div>
            </motion.div>
        );
    }


    if (!list || list.length === 0 && !savedpage) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }} className="flex items-center justify-center h-[60vh]">
                <div className="text-center bg-base-200 p-8 rounded-xl shadow-md max-w-sm w-full">
                    <p className="text-lg font-semibold mb-2">
                        ✍️ No Blogs Created Yet
                    </p>

                </div>
            </motion.div>
        );
    }

    return (
        <motion.div className={`grid grid-cols-1  md:grid-cols-3 gap-4 p-4 `} >

            {

                list?.map((b, i) => (
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
                    //         <div className="flex justify-between items-center "  >
                    //             <div>
                    //                 <h2 className="card-title">{b?.title}</h2>
                    //             </div>
                    //             <div>
                    //                 {savedpage ? "" : (<p className="badge badge-neutral p-3 " >  {b?.approval ? "Approved" : "Pending"}</p>)}

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
                    //         {savedpage ? "" : (
                    //             <div className="card-actions justify-end">
                    //                 <button className="btn btn-sm btn-secondary tooltip" data-tip="Review Content" da="true" onClick={() => navigate(`/review/${b._id}`, {
                    //                     state: { blogid: b._id }
                    //                 })}><MdOutlineReviews /></button>
                    //                 <button className="btn btn-sm tooltip" data-tip="Edit Content" da="true" onClick={() => navigate(`/edit-content/${b._id}`, {
                    //                     state: { t: b, editor: "editcontent" }
                    //                 })}><MdEdit /></button>

                    //                 {b?.approval ? (
                    //                     <button className="btn btn-error btn-sm tooltip" data-tip="Disapprove" da="true" onClick={() => {
                    //                         ab(b._id, b.title, b?.creator?._id)

                    //                     }}><FcDisapprove /></button>
                    //                 ) : (
                    //                     <button className="btn btn-primary btn-sm tooltip" data-tip="Approve" da="true" onClick={() => {
                    //                         ab(b._id, b.title, b?.creator?._id)

                    //                     }} ><FcApprove /></button>
                    //                 )}

                    //                 {b?.ep ? (
                    //                     <button className="btn btn-error btn-sm tooltip" data-tip="Unpick" da="true" onClick={() => pickep(b._id)}><IoCheckmarkCircleSharp /></button>
                    //                 ) : (
                    //                     <button className="btn btn-neutral btn-sm tooltip" data-tip="Pick" da="true" onClick={() => pickep(b._id)}><IoCheckmarkCircleOutline /></button>
                    //                 )}

                    //                 {
                    //                     b.collabrators?.includes(user.id) && (
                    //                         <button className="btn btn-sm tooltip" data-tip="Join" da="true" onClick={() => navigate(`/collab/${b._id}`, {
                    //                             state: { t: b }
                    //                         })}><MdOutlineConnectWithoutContact />Join</button>
                    //                     )
                    //                 }


                    //             </div>
                    //         )}

                    //         {
                    //             savedpage && (
                    //                 <div className="card-actions justify-end">
                    //                     <button className="btn btn-error" onClick={() => tblog(b._id)}><IoMdRemoveCircle />Remove</button>
                    //                 </div>
                    //             )
                    //         }




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

                        {
                            id === b._id && (
                                <Loading2 />
                            )
                        }

                        <figure className="relative h-full w-full">
                            <img
                                src={b?.coverimage || ""}
                                alt={b?.title || "Cover"}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/70"></div>
                        </figure>


                        <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">

                            <div className="flex justify-between items-center ">
                                <h2 className="card-title text-white">{b?.title}</h2>
                                <div>
                                    {savedpage ? "" : (<p className="badge badge-neutral p-3 " >  {b?.approval ? "Approved" : "Pending"}</p>)}

                                </div>
                            </div>



                            <div className="flex-grow overflow-hidden">
                                <div
                                    dangerouslySetInnerHTML={{ __html: getexcerpt(b?.blogtext) }}
                                    className="prose prose-invert max-w-none cursor-pointer line-clamp-3"
                                    onClick={() => navigate(`/blog/${b?._id}`, { state: { blogid: b?._id } })}
                                ></div>
                            </div>

                            {savedpage ? "" : (
                                <div className="card-actions flex justify-end gap-2 mt-2">
                                    <button className="btn btn-sm btn-secondary tooltip" data-tip="Review Content" da="true" onClick={() => navigate(`/review/${b._id}`, {
                                        state: { blogid: b._id }
                                    })}><MdOutlineReviews /></button>
                                    <button className="btn btn-sm tooltip" data-tip="Edit Content" da="true" onClick={() => navigate(`/edit-content/${b._id}`, {
                                        state: { t: b, editor: "editcontent" }
                                    })}><MdEdit /></button>

                                    {b?.approval ? (
                                        <button className="btn btn-error btn-sm tooltip" data-tip="Disapprove" da="true" onClick={() => {
                                            ab(b._id, b.title, b?.creator?._id)

                                        }}><FcDisapprove /></button>
                                    ) : (
                                        <button className="btn btn-primary btn-sm tooltip" data-tip="Approve" da="true" onClick={() => {
                                            ab(b._id, b.title, b?.creator?._id)

                                        }} ><FcApprove /></button>
                                    )}

                                    {b?.ep ? (
                                        <button className="btn btn-error btn-sm tooltip" data-tip="Unpick" da="true" onClick={() => pickep(b._id)}><IoCheckmarkCircleSharp /></button>
                                    ) : (
                                        <button className="btn btn-neutral btn-sm tooltip" data-tip="Pick" da="true" onClick={() => pickep(b._id)}><IoCheckmarkCircleOutline /></button>
                                    )}

                                    {
                                        b.collabrators?.includes(user.id) && (
                                            <button className="btn btn-sm tooltip" data-tip="Join" da="true" onClick={() => navigate(`/collab/${b._id}`, {
                                                state: { t: b }
                                            })}><MdOutlineConnectWithoutContact /></button>
                                        )
                                    }

                                </div>

                            )}

                            {
                                savedpage && (
                                    <div className="card-actions flex justify-end gap-2 mt-2">
                                        <button className="btn btn-error" onClick={() => tblog(b._id)}><IoMdRemoveCircle />Remove</button>
                                    </div>
                                )
                            }





                          </div>


                    </motion.div>
                ))
            }
        </motion.div>

    )
}