
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import useAuthstore from "../store/authstore";
import { generatebog } from "../services/openrouter";
import { IoIosClose } from "react-icons/io";


export default function Createblogs() {
    const { logout, setshownav, user } = useAuthstore()
    const [tag, settag] = useState("")
    const [loading, setloading] = useState(false)
    const [result, setresult] = useState("")
   const [tags,settags] = useState([])
   const[file,setfile] = useState("")


    const generate = async () => {
        setloading(true)
        try {
            const blog = await generatebog(result);
            console.log(blog);
            const cleanblog = blog?.replace(/[#*_`~>()\-]+/g,"").replace(/[""]+/g,"").trim()
            setresult(cleanblog)
        } catch (error) {
            console.log(error);
            setresult("failed to generate blogs")
        }finally{
            setloading(false)
        }
    }


  const addt = () => {
   
    if(tag){
        settags((prev) => {
            return [...prev, tag]
        })
        settag("")
        console.log(tags);
    }
  
  }

   const removet = (i) => {
   
    settags((prev) => {
        return prev.filter((t,x) => x !== i)
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
                    <div>
                         <textarea name=""  id="" className="textarea w-full h-[50vh] "  placeholder="write a blog with AI" onChange={(e) => setresult(e.target.value)} value={result}></textarea>
                    
                    <button className="btn mt-2" onClick={generate} >{loading ? <span>Generating<span className="loading loading-spinner loading-sm ml-2"></span></span>: "Generate Blog"}</button>
                    </div>
                   
                    <div className="mt-2">
                     <label htmlFor="f" className="block mb-1">Cover Image</label>
                    <input type="file" id="f" className="file-input" onChange={handlefile} />
                    </div>

                    <div className="mt-2">
                     <label htmlFor="f" className="block mb-1">Tags</label>
                     <div className="flex items-center gap-2 mb-2" >
                         {
                        tags?.map((t,i) => (
                            <div key={i} className="flex items-center btn btn-sm btn-neutral">
                               <p>#{t}</p> 
                               <IoIosClose className="text-2xl"  onClick={() => removet(i)} />
                            </div>
                        ))
                      }
                     </div>
                     
                    <input type="text" id="f" className="input mb-2" onChange={(e) => settag(e.target.value)}  value={tag}/>
                      <button className="btn" onClick={addt}>Add Tag</button>
                    </div>
                   
                </div>

            
            </div>


        </div>
    )
}