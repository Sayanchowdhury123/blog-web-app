import useHomestore from "@/store/homestore"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"


export default function Homecards (){
    const[loading,setloading] = useState(false)
    const {allblogs,fetchinfo} = useHomestore()

    const fetchl = async () => {
    setloading(true)
    try {
      await fetchinfo()
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false)
    }
  }
  
  console.log(allblogs);
    useEffect(() => {
    fetchl()
    },[])


        const getexcerpt = (text, wordlimit = 50) => {
        const words = text?.trim().split(/\s+/)
        if (words.length <= wordlimit) {
            return text
        } else {
            return words.slice(0, wordlimit).join(" ") + "..."
        }
    }

return (
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4" >

            {
                allblogs?.map((b, i) => (
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.9 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} className="card bg-base-100  image-full  shadow-sm" key={b._id} >
                        {
                            id === b._id && (
                                <Loading2 />
                            )
                        }
                        <figure>
                            <img
                                src={`${b.coverimage}`}
                                alt="Shoes" />
                        </figure>
                        <div className="card-body">
                            <div className="flex justify-between items-center ">
                                <div>
                                    <h2 className="card-title">{b?.title}</h2>
                                </div>
                                <div>
                                  <p className="badge badge-neutral p-3 " >  {b?.approval ? "Approved": "Pending"}</p>
                                </div>
                                 
                            </div>
                      

                            <div dangerouslySetInnerHTML={{
                                __html: getexcerpt(b.blogtext)
                            }} className="prose max-w-none cursor-pointer">

                            </div>
                            <p></p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-sm btn-secondary"  onClick={() => navigate(`/blog/${b._id}`, {
                                state: { blogid: b._id }
                            })}><MdOutlinePreview/>Review Content</button>
                                <button className="btn btn-sm " onClick={() => navigate(`/edit-content/${b._id}`, {
                                    state: { t: b , editor: "editcontent" }
                                })}><MdEdit/>Edit Content</button>

                                {b?.approval ? (
                                    <button className="btn btn-error btn-sm" onClick={() => ab(b._id)}><FcDisapprove/>Disapprove</button>
                                ) : (
                                    <button className="btn btn-primary btn-sm" onClick={() => ab(b._id)} ><FcApprove/>Approve</button>
                                )}


                            </div>
                        </div>
                    </motion.div>
                ))
            }
        </motion.div>

    )
}
   
