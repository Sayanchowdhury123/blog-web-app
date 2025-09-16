import useBlogmstore from "@/store/Blogm";
import useSearchstore from "@/store/searchstore";
import { motion } from "framer-motion"
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
export default function Au() {
    const { setfopen, allblog, filters, togglefilters, fetchfilteredblogs, setload, load } = useSearchstore()
    const [ua, setua] = useState([])
    const [utags, setutags] = useState([])
    const { setubox, ubox, fetchusers, users, selectusers, setselectusers } = useBlogmstore()




    useEffect(() => {
        fetchusers()
    }, [])

  


    return (

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="z-20 backdrop-blur-sm inset-0 fixed flex justify-center items-center">
            <div className="bg-base-200 w-[400px] h-[400px] p-6 rounded-xl space-y-2 overflow-scroll " style={{ scrollbarWidth: "none" }}>

                <div className="flex justify-end">
                    <IoMdClose onClick={setubox} />
                </div>


                <div className="">
                    <p className="font-semibold">Choose Users</p>
                    {
                        users.map((u, idx) => (
                            <div className="flex items-center gap-2" key={u._id}>

                                <input type="checkbox" checked={selectusers?.includes(u?._id)}
                                    onChange={() => {

                                        setselectusers(u._id)
                                    }}

                                />

                                {u.name}

                            </div>
                        ))
                    }
                </div>





                <div>
                    <button className="btn btn-primary">Apply</button>
                </div>

            </div>
        </motion.div>

    )
}