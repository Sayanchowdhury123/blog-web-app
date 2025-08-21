import useHomestore from "@/store/homestore"
import { FaEye, FaHeart, FaRegComment } from "react-icons/fa";
import { IoIosTrendingUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function Editorpicks() {
    const { trendingblogs,editorpicks } = useHomestore()
    const navigate = useNavigate()

    return (

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 1 }} className="bg-white w-[320px]    rounded-xl  absolute top-[200px] left-[1130px]  shadow-lg ">
            <div>
                <h1 className="text-xl font-bold  mt-3 px-4 flex items-center gap-2">Editor Picks<span class="material-symbols-outlined">editor_choice</span> </h1>
            </div>
            <div className="">
                {
                    editorpicks?.map((t) => (
                        <div key={t._id} onClick={() => navigate(`/blog/${t._id}`, {
                                state: { blogid: t._id }
                            })} className="hover:bg-base-200 py-2 px-4 transition-all transition-300 cursor-pointer" >

                            <p className="font-semibold flex items-center whitespace-wrap" >{t.title}</p>
                            <div className="flex items-center justify-start  text-sm text-gray-400 gap-4">
                                <p className="flex items-center gap-1"><FaHeart/>{t?.likes?.length} </p>
                                <p className="flex items-center gap-1"> <FaRegComment/>{t.comments?.length} Comments</p>
                            </div>
                        </div>
                    ))
                }
            </div>

        </motion.div>
    )
}