
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import useAuthstore from "../store/authstore";
import { generatebog } from "../services/openrouter";
import { IoIosClose } from "react-icons/io";
import { motion } from "framer-motion";
import { CiHashtag } from "react-icons/ci";
import { RiAiGenerate } from "react-icons/ri";

export default function Createblogs() {
    const { logout, setshownav, user } = useAuthstore()
    const [tag, settag] = useState("")
    const [loading, setloading] = useState(false)
    const [result, setresult] = useState("")
    const [tags, settags] = useState([])
    const [file, setfile] = useState("")


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
            console.log(tags);
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



    return (
        <div className="h-screen overflow-x-hidden  relative ">
            <Sidebar />
            <div className="p-4 ">
                <div className="flex items-center justify-between " >
                    <h1 className="text-4xl font-semibold"> Create Blogs</h1>
                    <img src="jj" alt="img" className="w-8 h-8 bg-black rounded-full" onClick={setshownav} />
                </div>

                <div className="mt-6  ">
                    <div className="relative">
                        <textarea name="" id="" className="textarea w-full h-[50vh] " placeholder="write a blog with AI" onChange={(e) => setresult(e.target.value)} value={result} style={{ scrollbarWidth: "none" }}></textarea>

                        <button className="btn mt-2 absolute bottom-4 z-20 right-6" onClick={generate} >{loading ? <span>Generating<span className="loading loading-spinner loading-sm ml-2"></span></span> : (<div className="flex items-center gap-1"><RiAiGenerate/><p>Generate Blog</p></div>)}</button>
                    </div>

                    <div className="mt-2">
                        <label htmlFor="f" className="block mb-1">Cover Image</label>
                        <input type="file" id="f" className="file-input" onChange={handlefile} required />
                    </div>

                    <div className="mt-2">
                        <label htmlFor="f" className="block mb-1">Tags</label>
                        <div className="flex items-center gap-2 mb-2" >
                            {
                                tags?.map((t, i) => (
                                    <div key={i} className="flex items-center btn btn-sm btn-neutral">
                                        <p>#{t}</p>
                                        <IoIosClose className="text-2xl" onClick={() => removet(i)} />
                                    </div>
                                ))
                            }
                        </div>

                        <div className="join">
                            <div>
                                <label className="input   join-item">
                                      <CiHashtag/>
                                    <input type="email" placeholder="Create tags" onChange={(e) => settag(e.target.value)} required />
                                </label>
                               
                            </div>
                            <button className="btn btn-neutral join-item" onClick={addt}>Add</button>
                        </div>

                    </div>

                </div>


            </div>


        </div>
    )
}