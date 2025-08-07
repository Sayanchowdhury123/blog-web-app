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

export default function Homecards() {
    const [loading, setloading] = useState(false)
    const { blogs, fetchinfo } = useHomestore()
    const navigate = useNavigate()






    return (

        <motion.div className="grid  sm:grid-cols-[450px] md:grid-cols-[600px] xl:grid-cols-[684px] justify-center gap-6 p-4 " >
            <div className=" ">
                {
                    blogs?.map((b, i) => {

                        const approved = b.approval;

                        return (
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} className=" bg-white shadow-sm rounded-xl   " key={b._id} >
                               {
                                approved && (
                                    <div className="">

                                    <div className="flex items-center gap-4 p-2 mt-2">
                                        <img src={b?.creator?.profilepic} alt="profile picture" className="w-8 h-8 rounded-full" />
                                        <div>
                                            <h1 className="text-xl font-semibold">{b?.creator.name}</h1>
                                            <p className="text-sm text-gray-600">{b?.creator?.role}</p>
                                        </div>

                                    </div>

                                    <p className="p-2 font-bold">{b?.title}</p>


                                    <figure>
                                        <img
                                            src={b?.coverimage}
                                            alt="Shoes" />
                                    </figure>


                                    <div className="px-4 mt-2  flex justify-between">
                                        <div>
                                            <p>20 Likes</p>
                                        </div>

                                        <div>
                                            <p>9 comments</p>
                                        </div>


                                    </div>

                                    <div className="px-2 my-2">
                                        <hr className="text-gray-300" />
                                    </div>


                                    <div className="flex justify-between p-4">

                                        <div>
                                            <button><FaRegHeart className="text-2xl" /></button>
                                        </div>

                                        <div>
                                            <button><FaRegComment className="text-2xl" /></button>
                                        </div>
                                        <div>
                                            <button><FaRegShareSquare className="text-2xl" /></button>
                                        </div>
                                        <div>
                                            <button><FaRegBookmark className="text-2xl" /></button>

                                        </div>

                                    </div>

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

