import api from "@/axios";
import useAuthstore from "@/store/authstore";
import useBlogmstore from "@/store/Blogm";
import useSearchstore from "@/store/searchstore";
import { motion } from "framer-motion"
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
export default function Au() {
    const { setfopen, allblog, filters, togglefilters, fetchfilteredblogs, setload, load } = useSearchstore()
    const [ua, setua] = useState([])
    const [utags, setutags] = useState([])
    const { setubox, ubox, fetchusers, users, selectusers, setselectusers } = useBlogmstore()
    const navigate = useNavigate()
    const {blog} = useBlogmstore()
    const {user} = useAuthstore()
    const[udata,setudata] = useState([])

    const startcollab = async () => {
        try {
            const res = await api.patch(`/blogs/${blog._id}/start-collab`, { blogid: blog._id, users: selectusers }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            console.log(res.data);
             
        } catch (error) {
          console.log(error);
        }
    }

    const endcollab = async () => {
        try {
            const res = await api.patch(`/blogs/${blog._id}/end-collab`, { blogid: blog._id}, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            console.log(res.data);
             
        } catch (error) {
          console.log(error);
        }
    }



    


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

                <div className="flex gap-4">
                     <button className="btn btn-success" onClick={() =>  {
                        startcollab()
                       navigate(`/collab/${blog._id}`,{
                      state: {t: blog,users:selectusers}
                    })
                     }}>Choose</button>

                      <button className="btn btn-error" onClick={() =>  {
                        endcollab()
                        useBlogmstore.setState({
                            selectusers: udata
                        })

                     }}>Reset</button>
                </div>

            </div>
        </motion.div>

    )
}