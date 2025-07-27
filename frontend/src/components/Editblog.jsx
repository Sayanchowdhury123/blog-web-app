
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import useAuthstore from "../store/authstore";
import { generatebog } from "../services/openrouter";
import { IoIosClose } from "react-icons/io";
import { motion } from "framer-motion";
import { CiHashtag } from "react-icons/ci";
import { RiAiGenerate } from "react-icons/ri";
import api from "../axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loadingscrenn from "../components/Loadingscreen";
import Loading2 from "./Loadin2";
import { FaEye } from "react-icons/fa";

export default function Editblog({ fb }) {
    const { logout, setshownav, user, blogid, setblogid, setshowedit, bloginfo } = useAuthstore()

    const [tag, settag] = useState("")
    const [loading, setloading] = useState(false)
    const [result, setresult] = useState(bloginfo.blogtext)
    const [tags, settags] = useState(bloginfo.tags)
    const [file, setfile] = useState("")
    const [title, settitle] = useState(bloginfo.title)
    const navigate = useNavigate()
    const [l, setl] = useState(false)

    const generate = async () => {
        setloading(true)
        try {
            const blog = await generatebog(result);
            console.log(blog);
            const cleanblog = blog?.replace(/[#*_`~>()]+/g, "").replace(/\n{2,}/g, "\n\n").replace(/-{2,}/g, "").replace(/"([^"]+)"/g, '$1').replace(/(?<=\s)-+(?=\s)/g, "").trim()
            setresult(cleanblog)
        } catch (error) {
            console.log(error);
            setresult("failed to generate blogs")
        } finally {
            setloading(false)
        }
    }


    const addt = () => {

        if (tag) {
            settags((prev) => {
                return [...prev, tag]
            })
            settag("")

        }

    }

    const removet = (i) => {

        settags((prev) => {
            return prev.filter((t, x) => x !== i)
        })

    }



    const handlefile = (e) => {
        const ci = e.target.files[0]
        setfile(ci)

    }

    const edittblogs = async () => {
        setl(true)
        const formdata = new FormData()
        formdata.append("title", title)
        formdata.append("tags", JSON.stringify(tags))
        formdata.append("coverimage", file)

        try {


            const res = await api.put(`/blogs/${bloginfo._id}/update-blog`, formdata, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "multipart/form-data"

                }
            })


            toast('Blog Updation successful',
                {
                    icon: '🎉',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                })

            setblogid()
            setshowedit()
            fb();





        } catch (error) {
            console.log(error);
            toast('Blog updation failed',
                {
                    icon: '❌',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                })
        } finally {
            setl(false)
        }
    }


    return (
        <div className="   relative  ">




            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 w-3xl mx-auto ">




                <div className=" bg-base-300 p-6 shadow-lg rounded-xl space-y-6 ">

                    <div>
                        <h1 className="text-3xl font-bold">Update Blog</h1>
                    </div>

                    <div className="">
                        <label htmlFor="b" className="label mb-2">
                            <span className="label-text font-semibold">Title</span>
                        </label>
                        <input type="text" id="b" className="input w-full" placeholder="Add title" required onChange={(e) => settitle(e.target.value)} value={title} />

                    </div>

                   

                    <div className="">
                        <label htmlFor="f" className="label mb-2 ">
                            <span className="label-text font-semibold">Cover Image</span>
                            <a href={bloginfo.coverimage} target="_blank" rel="noopener noreferrer" className="tooltip mt-1" data-tip="Preview"><FaEye/></a>
                        </label>
                        <input type="file" id="f" className="file-input w-full" onChange={handlefile} required />
                    </div>

                    <div className="">
                        <label htmlFor="t" className="label mb-2">
                            <span className="label-text font-semibold">Tags</span>
                        </label>
                        <div className="flex flex-wrap gap-2 " >
                            {
                                tags?.map((t, i) => (
                                    <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center badge badge-neutral gap-1 px-2 py-1 cursor-pointer">
                                        <p>#{t}</p>
                                        <IoIosClose className="text-2xl" onClick={() => removet(i)} />
                                    </motion.div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <label htmlFor="t" className="label mb-2">
                                <span className="label-text font-semibold">Add Tag</span>
                            </label>

                            <input type="email" id="t" className="input w-full" value={tag} placeholder="Create tag..." onChange={(e) => settag(e.target.value)} required />
                        </div>
                        <button className="btn btn-neutral " onClick={addt}>Add</button>
                    </div>


                    <div className="text-right">
                        <button className="btn btn-primary mr-2" onClick={edittblogs}>Update Blog</button>
                        <button className="btn btn-error" onClick={setshowedit}>Cancel</button>
                    </div>

                </div>
            </motion.div>
        </div>
    )
}