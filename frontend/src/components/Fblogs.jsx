import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function Fblogs({ b, i }) {
const navigate = useNavigate()

    const getexcerpt = (text, wordlimit = 50) => {
        const words = text?.trim().split(/\s+/)
        if (words?.length <= wordlimit) {
            return text
        } else {
            return words?.slice(0, wordlimit).join(" ") + "..."
        }
    }

    return (

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: i * 0.1, duration: 0.3 }} className={`rounded-xl overflow-hidden relative   card bg-base-100 h-[300px] text-white  shadow-sm`} key={b._id} >

            <figure className="">
                <img
                    src={`${b.coverimage}`}
                    alt="coverimages" className="w-full h-full object-cover absolute inset-0  " />
            </figure>
            <div className="absolute inset-0 bg-black/70"></div>
            <div className="relative card-body">
                <div className="flex justify-between items-center ">
                    <div>
                        <h2 className="card-title">{b?.title}</h2>
                    </div>

                </div>


                <div dangerouslySetInnerHTML={{
                    __html: getexcerpt(b.blogtext)
                }} className="prose max-w-none cursor-pointer" onClick={() => navigate(`/blog/${b._id}`, {
                    state: { blogid: b._id }
                })} >

                </div>
                <p></p>
            </div>
        </motion.div>
    )
}