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

export default function Card() {
    const { fetchall, blogs, approveblog, bid, setbid ,bloginfo} = useEditorstore();
    const { setshownav, user } = useAuthstore()
    const [loading, setloading] = useState(false)
    const [id, setid] = useState(null)
    const navigate = useNavigate()
    console.log(bloginfo);

    const getexcerpt = (text, wordlimit = 50) => {
        const words = text?.trim().split(/\s+/)
        if (words.length <= wordlimit) {
            return text
        } else {
            return words.slice(0, wordlimit).join(" ") + "..."
        }
    }

    const ab = async (blogid) => {
        setid(blogid)
        try {

            await approveblog(blogid)
            toast(`${bloginfo?.approval  ? "Blog Disapproved" : "Blog Approved"}`,
                {
                    icon: '🎉',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                })


        } catch (error) {
            console.log(error);
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

    return (
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4" >

            {
                blogs?.map((b, i) => (
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.9 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} className="card bg-base-100  image-full  shadow-sm" key={b._id} >
                        {
                            id === b._id && (
                                <Loading2 />
                            )
                        }
                        <figure>
                            <img
                                src={`${b.coverimage}`}
                                alt="Shoes" />
                        </figure>
                        <div className="card-body">
                            <div className="flex justify-between items-center ">
                                <div>
                                    <h2 className="card-title">{b?.title}</h2>
                                </div>
                                <div>
                                  <p className="badge badge-neutral p-3 " >  {b?.approval ? "Approved": "Pending"}</p>
                                </div>
                                 
                            </div>
                      

                            <div dangerouslySetInnerHTML={{
                                __html: getexcerpt(b.blogtext)
                            }} className="prose max-w-none cursor-pointer">

                            </div>
                            <p></p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-sm btn-secondary"  onClick={() => navigate(`/blog/${b._id}`, {
                                state: { blogid: b._id }
                            })}>Review Content</button>
                                <button className="btn btn-sm " onClick={() => navigate(`/edit-content/${b._id}`, {
                                    state: { t: b }
                                })}><MdEdit/>Edit Content</button>

                                {b?.approval ? (
                                    <button className="btn btn-error btn-sm" onClick={() => ab(b._id)}><FcDisapprove/>Disapprove</button>
                                ) : (
                                    <button className="btn btn-primary btn-sm" onClick={() => ab(b._id)} ><FcApprove/>Approve</button>
                                )}


                            </div>
                        </div>
                    </motion.div>
                ))
            }
        </motion.div>

    )
}