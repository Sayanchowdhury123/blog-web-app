import Loading3 from "@/components/Loading3"
import Loadingscrenn from "@/components/Loadingscreen"
import NotFound from "@/components/Notfound"
import Sblogs from "@/components/Sblogs"
import Sidebar from "@/components/Sidebar"
import useAuthstore from "@/store/authstore"
import useHomestore from "@/store/homestore"
import useProfilestore from "@/store/profilestore"
import useSearchstore from "@/store/searchstore"
import { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast"

export default function Search() {
    const { logout, setshownav, user, shownav } = useAuthstore()
    const { userinfo, fetchuser } = useProfilestore()
    const { search, blogs, fetchinfo, l, sorting ,addsh,getsh,sh} = useSearchstore()
    const navigate = useNavigate()
    const [st, setst] = useState("")
    const [load, setload] = useState(false)
    const [loading, setloading] = useState(false)
    const [sv, setsv] = useState("all")

    useEffect(() => {
        fetchuser()
    }, [])

    const fetchblogs = async () => {
        setloading(true)
        try {
            await fetchinfo()
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        fetchblogs()
    }, [])


    const searching = async() => {
        setload(true)
        
        try {
            if (st) {
              await search(st)
               await addsh(st)
             
            }
        } catch (error) {
            console.log(error);
        } finally {
            setload(false)
        }
    }


    useEffect(() => {
        
     fetchblogs() 
    }, [])

    useEffect(() => {
     if(st.length === 0){
        fetchblogs()
     }
     
    },[st])

    

    
    const sort = async (e) => {
    
         setsv(e.target.value) 
        setload(true)
        try {

         
            await sorting(e.target.value)

        } catch (error) {
            console.log(error);
        } finally {
            setload(false)
        }
    }



    const fetchsh = async () => {
        
        try {
            await getsh()
            console.log(sh);
        } catch (error) {
            console.log(error);
        }
    }

    

    if (loading) return <Loadingscrenn />
    if (load) return <Loading3 />

    return (
        <div className="  relative bg-base-100 ">

            <Sidebar />





            <div className=" h-screen">


                <div className="flex items-center justify-between sticky top-0  shadow p-4 bg-white z-20 " >
                    <h1 className="text-4xl font-bold cursor-pointer" onClick={(e) => {

                        navigate("/home")
                    }}>  BlogApp</h1>


                    <div className="flex ">

                        <img src={userinfo.profilepic} alt="img" className="w-8 h-8 bg-black rounded-full" onClick={(e) => {

                            setshownav
                        }} />
                    </div>

                </div>


                <div className="mt-6 flex justify-center gap-2">
                    <div>
                        <div className="flex gap-2">
                         <input type="text" className="input " onChange={(e) => {setst(e.target.value)}} onFocus={fetchsh} value={st} placeholder="Search" />
                        <button className="btn" onClick={() => {
                            searching()
                            
                        }} ><FaSearch /></button>
                    </div>

                    
                    </div>
                  
                    <div>
                        <select name="" id="" className="select" onChange={(e) => sort(e)} value={sv}>
                            <option value="all">All</option>
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="popularity">Popularity</option>
                        </select>
                    </div>
                </div>




                {blogs?.length === 0 ? (
                    <NotFound />
                ) : (<Sblogs />)}

            </div>
        </div>
    )
}