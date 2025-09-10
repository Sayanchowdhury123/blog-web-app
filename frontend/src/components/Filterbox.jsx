import useSearchstore from "@/store/searchstore";
import { motion } from "framer-motion"
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
export default function Filterbox() {
    const { setfopen, blogs } = useSearchstore()
    const [ua, setua] = useState([])
    const [utags, setutags] = useState([])


    const uq = () => {
        const uq = blogs.filter((blog, index, self) => index === self.findIndex(b => b.creator.name === blog.creator.name))
        setua(uq)
    }

    const uniqutags = () => {
        const ut = [...new Set(blogs.flatMap(b => b.tags))]
        setutags(ut)
    }


    useState(() => {
        uq()
        uniqutags()
    }, [blogs])

console.log(utags);





    return (

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="z-20 backdrop-blur-sm inset-0 fixed flex justify-center items-center">
            <div className="bg-base-200 w-[400px] h-[400px] p-6 rounded-xl space-y-4 overflow-scroll " style={{ scrollbarWidth: "none" }}>

                <div className="flex justify-end">
                    <IoMdClose onClick={setfopen} />
                </div>


                <div className="">
                    <p>Authors</p>
                    {
                        ua.map((u) => (
                            <div className="flex items-center gap-4" key={u._id}>
                                <p>{u.creator.name}</p>
                                <input type="checkbox" name="" id="" />
                            </div>
                        ))
                    }
                </div>

                  <div className="">
                    <p>Tags</p>
                    {
                        utags.map((u,i) => (
                            <div className="flex items-center gap-2" key={i}>
                                <p>{u}</p>
                                <input type="checkbox" name="" id="" />
                            </div>
                        ))
                    }
                </div>



            </div>

        </motion.div>

    )
}