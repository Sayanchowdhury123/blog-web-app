import useHomestore from "@/store/homestore"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import Loading2 from "./Loadin2";
import toast from "react-hot-toast"
import { FcApprove } from "react-icons/fc";
import { FcDisapprove } from "react-icons/fc";
import { MdEdit } from "react-icons/md";
import { MdOutlinePreview } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaTwitter } from "react-icons/fa";
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
import { FaCopy } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import Trending from "./Trending";



export default function Homecards() {
    const [loading, setloading] = useState(false)
    const { blogs, fetchinfo, h } = useHomestore()
    const navigate = useNavigate()
    const { togglelike, removelike, commentsByBlog } = useHomestore()
    const { user } = useAuthstore()
    const { userinfo, tblog } = useProfilestore()
    const [openBlogId, setOpenBlogId] = useState(null);
    const [option, setoption] = useState(null)
    const bottomref = useRef(null)
    const [showlink, setshowlink] = useState(null)


    useEffect(() => {
        if (loading) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && h) {
                fetchblogs()
            }
        }, {
            threshold: 1.0
        })

        if (bottomref.current) {
            observer.observe(bottomref.current)
        }

        return () => {
            if (bottomref.current) observer.unobserve(bottomref.current)
        }
    }, [loading, h, fetchinfo])

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

    const fetchblogs = async () => {
        setloading(true)
        try {
            await fetchinfo()
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }

    const copylink = (blogid) => {

        const posturl = `http://localhost:5173/blog/${blogid}`;
        navigator.clipboard.writeText(posturl)
        toast('Link copied to clipboard',
            {
                icon: '✅',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            })

    }

    const sharetofacebook = (blogid, blogtitle) => {
        const blogurl = `http://localhost:5173/blog/${blogid}`;
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogurl)}`;
        window.open(url, "_blank", "width=600,height=400");
    };

    const shareOnTwitter = (blogid, blogtitle) => {
        const blogurl = `http://localhost:5173/blog/${blogid}`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(blogtitle)}&url=${encodeURIComponent(blogurl)}`;
        window.open(url, "_blank", "width=600,height=400");
    };


    const shareOnInstagram = (blogid) => {
        const blogurl = `http://localhost:5173/blog/${blogid}`;
        navigator.clipboard.writeText(blogurl);
        toast('Blog link copied!',
            {
                icon: '✅',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            })

    };





    return (

        <div className="">


 
            <motion.div className="grid sm:grid-cols-[500px]  md:grid-cols-[600px] lg:grid-cols-[684px]  gap-6 p-4 bg-base-100 justify-center" >
                <div className=" ">
                    {
                        blogs?.map((b, i) => {

                            const approved = b.approval;
                            const isliked = b?.likes?.includes(user.id)
                            const issaved = userinfo?.savedblogs?.includes(b._id)

                            return (
                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} className=" bg-white shadow-sm rounded-xl cursor-pointer  " key={b._id} >


                                    <div className="">

                                      
                                        <div className="flex items-center gap-4 p-2 mt-2">
                                            <img src={b?.creator?.profilepic} alt="profile picture" className="w-8 h-8 rounded-full" />
                                            <div>
                                                <h1 className="text-xl font-semibold" onClick={() => navigate(`/f-page/${b?.creator?._id}`)}>{b?.creator.name}</h1>
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
                                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setOpenBlogId(openBlogId === b._id ? null : b._id)}><FaRegComment className="text-2xl" /></motion.button>
                                            </div>

                                            <div className="relative flex justify-center  ">

                                                {
                                                    showlink === b._id && (
                                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute z-10  flex items-center  bottom-10 gap-4 bg-base-300 p-3 shadow rounded-xl">
                                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                <button className="" onClick={() => copylink(b._id)}><FaCopy className="text-2xl" /></button>
                                                            </motion.div>

                                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                <button className="" onClick={() => sharetofacebook(b._id, b?.title)}><FaFacebook className="text-2xl" /></button>
                                                            </motion.div>


                                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                <button className="" onClick={() => shareOnTwitter(b._id, b?.title)}><FaSquareXTwitter className="text-2xl" /></button>
                                                            </motion.div>

                                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                <button className="" onClick={() => shareOnInstagram(b._id, b?.title)}><FaInstagram className="text-2xl" /></button>
                                                            </motion.div>



                                                        </motion.div>
                                                    )
                                                }

                                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} ><FaRegShareSquare onClick={() => setshowlink(showlink === b._id ? null : b._id)} className="text-2xl" /></motion.button>
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





                                </motion.div>


                            )

                        })
                    }

                    <div ref={bottomref} className="h-[20px]" />
                    <div className="text-center">
                        {loading && (<span className="loading loading-xl  loading-spinner"></span>)}
                        {!h && (<p className="font-sans text-xl font-semibold">No more blogs</p>)}
                    </div>



                </div>



            </motion.div>
        </div>




    )

}
