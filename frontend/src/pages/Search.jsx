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
import { motion } from "framer-motion"
import { FaHistory } from "react-icons/fa";
import Filterbox from "@/components/Filterbox"
import Navbar from "@/components/Navbar"

export default function Search() {
    const { logout, setshownav, user, shownav } = useAuthstore()
    const { userinfo, fetchuser } = useProfilestore()
    const { search, blogs, fetchinfo, l, sorting, addsh, getsh, sh, fopen, setfopen, load } = useSearchstore()
    const navigate = useNavigate()
    const [st, setst] = useState("")
    const [loadi, setload] = useState(false)
    const [loading, setloading] = useState(false)
    const [sv, setsv] = useState("all")
    const [shopen, setshopen] = useState(false)
    const [searchhistory, setsearchhistory] = useState([])


    useEffect(() => {
   
        setsearchhistory(sh)
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


    const searching = async () => {
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
        if (st.length === 0) {
            fetchblogs()
        }

    }, [st])




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

        } catch (error) {
            console.log(error);
        }
    }

    const onChangesearch = (s) => {

        if (s.length > 0) {
            const sr = sh.filter((ss) => ss.toLowerCase().includes(s.toLowerCase()))
            setsearchhistory(sr)

        } else {
            setsearchhistory(sh)
        }
    }





    if (loading) return <Loadingscrenn />
    if (loadi) return <Loading3 />
    if (load) return <Loading3 />

    return (
        <div className="  relative bg-base-100 ">

            <Sidebar />





            <div className=" h-screen">

                {
                    fopen && (
                        <Filterbox />
                    )
                }


                 

                <Navbar/>


                <div className="mt-6 sm:flex block   justify-center lg:gap-50 sm:gap-10">
                    <div className="">
                        <div className="flex gap-2 justify-center mb-4 ">
                            <input type="text" className="input " onChange={(e) => {
                                setst(e.target.value)
                                onChangesearch(e.target.value)
                            }} onClick={() => {
                                setshopen((prev) => !prev)
                                fetchsh()

                            }} value={st} placeholder="Search" />
                            <button className="btn" onClick={() => {
                                searching()

                            }} ><FaSearch /></button>

                        </div>


                        {
                            shopen && (

                                <div>
                                    {
                                        searchhistory.length > 0 && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className=" z-10 bg-base-200 p-4 sm:w-[220px] w-[308px] rounded-bl-xl rounded-xl absolute top-[144px] sm:left-[221px] left-[32px]  shadow-xl" >

                                                {
                                                    searchhistory?.map((s, i) => (
                                                        <div key={i} className="py-2 hover:text-gray-500 cursor-pointer flex items-center gap-3" onClick={() => {
                                                            setshopen(false)
                                                            search(s)
                                                            setst(s)
                                                        }} >

                                                            <FaHistory /><p>{s}</p>
                                                        </div>
                                                    ))
                                                }
                                            </motion.div>
                                        )
                                    }

                                </div>

                            )
                        }




                    </div>

                    <div className="flex sm:gap-2 gap-[203px] justify-center  ">
                        <div>
                            <select name="" id="" className="select" onChange={(e) => sort(e)} value={sv}>
                                <option value="all">All</option>
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="popularity">Popularity</option>
                            </select>
                        </div>


                        <div>
                            <button className="btn" onClick={setfopen}>Filter</button>

                        </div>
                    </div>


                </div>




                {blogs?.length === 0 ? (
                    <NotFound />
                ) : (<Sblogs />)}

            </div>
        </div>
    )
}