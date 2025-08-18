import useHomestore from "@/store/homestore"
import { FaEye } from "react-icons/fa";
import { IoIosTrendingUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";
import { MdOutlineRecommend } from "react-icons/md";

export default function Recom() {
    const { trendingblogs,recomdations,fetchr } = useHomestore()
    const navigate = useNavigate()

 useEffect(() => {
  fetchr()
 },[])

 console.log(recomdations);
    return (

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 1 }} className="bg-white  rounded-xl  absolute top-[22px] left-[1130px] cursor-pointer shadow-lg">
            <div>
                <h1 className="text-xl font-bold  mt-3 px-4 flex items-center gap-2">Recommanded Blogs<MdOutlineRecommend className=" text-xl" /> </h1>
            </div>
            <div className="">
                {
                    recomdations?.map((t) => (
                        <div key={t._id} onClick={() => navigate(`/blog/${t._id}`, {
                                state: { blogid: t._id }
                            })} className="hover:bg-base-200 py-2 px-4 transition-all transition-300" >

                            <p className="font-semibold flex items-center  truncate" >{t.title}</p>
                            <div className="flex items-center  text-sm text-gray-400 gap-4">
                                <p>{t?.creator?.name}</p>
                              
                            </div>
                        </div>
                    ))
                }
            </div>

        </motion.div>
    )
}