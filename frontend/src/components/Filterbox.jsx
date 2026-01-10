import useSearchstore from "@/store/searchstore";
import { motion } from "framer-motion"
import { useState } from "react";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
export default function Filterbox() {
    const { setfopen, allblog ,filters, togglefilters, fetchfilteredblogs,setload,load} = useSearchstore()
    const [ua, setua] = useState([])
    const [utags, setutags] = useState([])


    const uq = () => {
        const uq = allblog.filter((blog, index, self) => index === self.findIndex(b => b.creator.name === blog.creator.name))
        setua(uq)
    }

    const uniqutags = () => {
        const ut = [...new Set(allblog.flatMap(b => b.tags))]
        setutags(ut)
    }


    useState(() => {
        uq()
        uniqutags()
    }, [allblog])



const handleapply = () => {

    try {
        fetchfilteredblogs()
    setfopen()
    } catch (error) {
        toast.error(error.response?.data?.msg || "Something went wrong");
    }
}



    return (

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="z-20 backdrop-blur-sm inset-0 fixed flex justify-center items-center px-4">
            <div className="bg-base-200 w-[400px] h-[400px] p-6 rounded-xl space-y-2 overflow-scroll " style={{ scrollbarWidth: "none" }}>

                <div className="flex justify-end">
                    <IoMdClose onClick={setfopen} />
                </div>


                <div className="">
                    <p className="font-semibold">Authors</p>
                    {
                        ua.map((u,idx) => (
                            <div className="flex items-center gap-2" key={u._id}>
                                
                                <input type="checkbox" checked={filters?.creators?.includes(u?.creator?._id)}
                                onChange={() => {
                                   
                                 
                                    togglefilters("creators",u?.creator?._id) 
                                } }
                              
                                />

                                  {u.creator.name}

                            </div>
                        ))
                    }
                </div>

                  <div className="">
                    <p className="font-semibold">Tags</p>
                    {
                        utags.map((t,i) => (
                            <div className="flex items-center gap-2" key={i}>
                                
                                <input type="checkbox" checked={filters?.tags?.includes(t)}
                                onChange={() => togglefilters("tags",t)} />
                                {t}
                            </div>
                        ))
                    }
                </div>

                <div>
                    <p className="font-semibold">Editor's picks</p>
                  <label className="flex items-center gap-2">
                      <input type="checkbox" checked={filters.editorpicks === true} onChange={(e) => {
                        togglefilters("editorpicks",e.target.checked)
                      }} />
                      Yes
                      </label>
                     
                </div>

              
              <div>
                <button onClick={handleapply} className="btn btn-primary">Apply</button>
              </div>

            </div>
        </motion.div>

    )
}