
import { useEffect, useState } from "react";
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
import useProfilestore from "@/store/profilestore";

export default function Createblogs() {
    const { logout, setshownav, user } = useAuthstore()
    const [tag, settag] = useState("")
    const [loading, setloading] = useState(false)
    const [result, setresult] = useState("")
    const [tags, settags] = useState([])
    const [file, setfile] = useState("")
    const [title, settitle] = useState("")
    const navigate = useNavigate()
    const [l, setl] = useState(false)
 const {fetchuser,userinfo} = useProfilestore()

    const typewritereffect = (text) => {
        let i = 0;
        setresult("")
        const interval = setInterval(() => {
            setresult((prev) => prev + text?.charAt(i))
            i++;
            if (i >= text?.length) {
                clearInterval(interval)
            }
        }, 20);
    }

    const generate = async () => {
        setloading(true)
        try {
            const blog = await generatebog(result);
            console.log(blog);
            const cleanblog = blog?.replace(/[#*_`~>()]+/g, "").replace(/\n{2,}/g, "\n\n").replace(/-{2,}/g, "").replace(/"([^"]+)"/g, '$1').replace(/(?<=\s)-+(?=\s)/g, "").trim()
            typewritereffect(cleanblog)
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

    const createblogs = async () => {
        setl(true)
        const formdata = new FormData()
        formdata.append("title", title)
        formdata.append("blogtext", result)
        formdata.append("tags", JSON.stringify(tags))
        formdata.append("coverimage", file)

        try {

            if (file && Array.isArray(tags) && title && result) {
                const res = await api.post("/blogs/create-blog", formdata, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "multipart/form-data"

                    }
                })

                console.log(res.data);
                toast('Blog creation successful',
                    {
                        icon: '🎉',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    })

                navigate("/yourblogs")
            }
        } catch (error) {
            console.log(error);
            toast('Blog creation failed',
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

    useEffect(() => {
   fetchuser()
    },[])

    if (l) return <Loadingscrenn />

    return (
        <div className=" overflow-x-hidden  relative  h-screen">
            <Sidebar />



             <div className="flex items-center justify-between sticky top-0  shadow p-4 bg-white z-20 " onClick={(e) => {
          e.stopPropagation()
          setshownav
        }}>
          <h1 className="text-4xl font-bold" onClick={(e) => {
            e.stopPropagation()
            navigate("/home")
          }}>  BlogApp</h1>
          <img src={userinfo.profilepic} alt="img" className="w-8 h-8 bg-black rounded-full" />
        </div>
        
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 w-3xl mx-auto ">




                <div className=" bg-base-300 p-6 shadow-lg rounded-xl space-y-6 ">

                    <div>
                        <h1 className="text-3xl font-bold">Create Blog</h1>
                    </div>

                    <div className="">
                        <label htmlFor="b" className="label mb-2">
                            <span className="label-text font-semibold">Title</span>
                        </label>
                        <input type="text" id="b" className="input w-full" placeholder="Add title" required onChange={(e) => settitle(e.target.value)} />

                    </div>

                    <div className="relative">
                        <label className="label mb-2" htmlFor="c">
                            <span className="label-text font-semibold">Content</span>
                        </label>
                        <textarea name="" id="c" className="textarea  w-full min-h-[150px] " placeholder="write a blog with AI" onChange={(e) => setresult(e.target.value)} required value={result} style={{ scrollbarWidth: "none", scrollBehavior: "smooth" }}></textarea>

                        <button className="btn mt-2 absolute bottom-4 z-20 right-6" onClick={generate} >{loading ? <span>Generating<span className="loading loading-spinner loading-sm ml-2"></span></span> : (<div className="flex items-center gap-1"><RiAiGenerate /><p>Generate Blog</p></div>)}</button>
                    </div>

                    <div className="">
                        <label htmlFor="f" className="label mb-2">
                            <span className="label-text font-semibold">Cover Image</span>
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


                    <div className=" flex justify-end gap-2">
                        <button className="btn btn-primary" onClick={createblogs}>Create Blog</button>
                        <button className="btn btn-error" onClick={() => navigate("/yourblogs")}>Cancel</button>
                    </div>

                </div>
            </motion.div>
        </div>
    )
}