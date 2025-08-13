import useHomestore from "@/store/homestore"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Loading2 from "./Loadin2";
import toast from "react-hot-toast"
import { FcApprove } from "react-icons/fc";
import { FcDisapprove } from "react-icons/fc";
import { MdEdit } from "react-icons/md";
import { MdOutlinePreview } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { CiShare1 } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { MdOutlineComment } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FaRegShareSquare } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import Loadingscrenn from "./Loadingscreen";
import useAuthstore from "@/store/authstore";
import useProfilestore from "@/store/profilestore";
import Comments from "./Comments";



export default function Homecards() {
    const [loading, setloading] = useState(false)
    const { blogs, fetchinfo } = useHomestore()
    const navigate = useNavigate()
    const { togglelike, removelike, commentsByBlog } = useHomestore()
    const { user } = useAuthstore()
    const { userinfo, tblog } = useProfilestore()
    const [openBlogId, setOpenBlogId] = useState(null);
    const[option,setoption] = useState(null)


    const getlike = async (id) => {
        setloading(true)
        try {
            await togglelike(id)

        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }

    const rlike = async (id) => {
        setloading(true)
        try {
            await removelike(id)

        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }

    const toggleblog = async (blogid) => {

        try {
            await tblog(blogid)


        } catch (error) {
            console.log(error);
        }
    }


    // console.log(comid);

    return (

        <motion.div className="grid  sm:grid-cols-[450px] md:grid-cols-[600px] xl:grid-cols-[684px] justify-center gap-6 p-4 bg-base-100" >
            <div className=" ">
                {
                    blogs?.map((b, i) => {

                        const approved = b.approval;
                        const isliked = b?.likes?.includes(user.id)
                        const issaved = userinfo?.savedblogs?.includes(b._id)

                        return (
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} className=" bg-white shadow-sm rounded-xl   " key={b._id} >
                                {
                                    approved && (
                                        <div className="">


                                            <div className="flex items-center gap-4 p-2 mt-2">
                                                <img src={b?.creator?.profilepic} alt="profile picture" className="w-8 h-8 rounded-full" />
                                                <div>
                                                    <h1 className="text-xl font-semibold">{b?.creator.name}</h1>
                                                    <p className="text-[12px] text-gray-600">Posted on: {new Date(b?.createdAt).toLocaleDateString()}</p>
                                                </div>

                                            </div>

                                            <p className="p-2 font-bold">{b?.title}</p>


                                            <figure>
                                                <img
                                                    src={b?.coverimage}
                                                    alt="Shoes"
                                                    onClick={() => navigate(`/blog/${b._id}`, {
                                                        state: { blogid: b._id }
                                                    })}
                                                />
                                            </figure>


                                            <div className="px-4 mt-2  flex justify-between">
                                                <div className="flex items-center gap-2">
                                                    <p>{b?.likes?.length} Likes</p>
                                                    <p>{b?.views?.length || 0} Views</p>
                                                </div>

                                                <div>
                                                    <p>{b?.comments?.length} Comments</p>
                                                </div>


                                            </div>

                                            <div className="px-2 my-2">
                                                <hr className="text-gray-300" />
                                            </div>


                                            <div className="flex justify-between p-4">

                                                <motion.div
                                                    key={isliked}
                                                    initial={{ scale: 0.5 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    {isliked ? (
                                                        <motion.button whileTap={{ scale: 1.3 }} whileHover={{ scale: 1.2 }} animate={{ color: "#e0245e" }} transition={{ type: "spring", stiffness: 300 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                rlike(b._id)
                                                            }}><FaHeart className="text-2xl" /></motion.button>
                                                    ) : (
                                                        <motion.button whileTap={{ scale: 1.2 }} whileHover={{ scale: 1.1 }} animate={{ color: "#555" }} transition={{ type: "spring", stiffness: 300 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                getlike(b._id)
                                                            }}><FaRegHeart className="text-2xl" /></motion.button>
                                                    )}

                                                </motion.div>

                                                <div>
                                                    <button onClick={() => setOpenBlogId(openBlogId === b._id ? null : b._id)}><FaRegComment className="text-2xl" /></button>
                                                </div>
                                                <div>
                                                    <button><FaRegShareSquare className="text-2xl" /></button>
                                                </div>

                                                <div>
                                                    {userinfo?.savedblogs?.includes(b._id) ? (
                                                        <motion.button whileTap={{ scale: 1.3 }} whileHover={{ scale: 1.2 }} animate={{ color: "#A9A9A9" }} transition={{ type: "spring", stiffness: 300 }} onClick={(e) => {
                                                            e.stopPropagation()
                                                            toggleblog(b._id)
                                                        }} ><FaBookmark className="text-2xl" /></motion.button>
                                                    ) : (
                                                        <motion.button whileTap={{ scale: 1.2 }} whileHover={{ scale: 1.1 }} animate={{ color: "#555" }} transition={{ type: "spring", stiffness: 300 }} onClick={(e) => {
                                                            e.stopPropagation()
                                                            toggleblog(b._id)
                                                        }} ><FaRegBookmark className="text-2xl" /></motion.button>
                                                    )}
                                                </div>




                                            </div>


                                            {openBlogId === b._id && (
                                                <Comments blogId={b._id} />
                                            )}


                                        </div>
                                    )
                                }



                            </motion.div>
                        )

                    })
                }
            </div>

        </motion.div>



    )
}

