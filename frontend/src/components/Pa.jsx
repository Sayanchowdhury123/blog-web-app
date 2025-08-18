
import useHomestore from "@/store/homestore"
import { FaEye } from "react-icons/fa";
import { IoIosTrendingUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { CgProfile } from "react-icons/cg";

export default function Pa() {
  const {pa} = useHomestore()
    const navigate = useNavigate()
    const uniqueauthors =[];
    const seen = new Set();

    pa.forEach((blog) => {
       if(!seen.has(blog?.creator?.name)) {
        seen.add(blog?.creator?.name)
        uniqueauthors.push(blog)
       }
    });

   


    return (

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 1 }} className="bg-white w-[320px]  rounded-xl absolute top-[380px] left-[70px] cursor-pointer shadow-lg">
            <div>
                <h1 className="text-xl font-bold  mt-3 px-5 flex items-center gap-2">Popular Authors<CgProfile className=" text-xl" /> </h1>
            </div>
            <div className="">
                {
                    uniqueauthors?.map((t) => (
                        <div key={t._id} onClick={() => navigate(`/blog/${t._id}`, {
                                state: { blogid: t._id }
                            })} className="p-4 flex items-center gap-2 hover:bg-base-200" >
                          <img src={t?.creator?.profilepic} alt="profilepic" className="w-10 h-10 rounded-full" />
                          <p className="font-semibold">{t?.creator?.name}</p>
                        </div>
                    ))
                }
            </div>

        </motion.div>
    )
}