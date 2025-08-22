import useHomestore from "@/store/homestore"
import { FaEye } from "react-icons/fa";
import { IoIosTrendingUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function Trending() {
    const { trendingblogs } = useHomestore()
    const navigate = useNavigate()


    return (

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 1 }} className="bg-white  rounded-xl  absolute top-[22px] left-[70px] cursor-pointer shadow-lg">
            <div>
                <h1 className="text-xl font-bold  mt-3 px-4 flex items-center gap-2">Trending Blogs<IoIosTrendingUp className=" text-xl" /> </h1>
            </div>
            <div className="">
                {
                    trendingblogs?.map((t) => (
                        <div key={t._id} onClick={() => navigate(`/blog/${t._id}`, {
                                state: { blogid: t._id }
                            })} className="hover:bg-base-200 py-2 px-4 transition-all transition-300" >

                            <p className="font-semibold flex items-center  truncate" >{t.title}</p>
                            <div className="flex items-center  text-sm text-gray-400 gap-4">
                                <p>{t?.creator?.name}</p>
                                <p className=""> {t.views?.length} Readers</p>
                            </div>
                        </div>
                    ))
                }
            </div>

        </motion.div>
    )
}