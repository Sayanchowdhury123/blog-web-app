import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import useAuthstore from "../store/authstore"
import useEditorstore from "@/store/editorstore"
import { useEffect, useState } from "react"
import Card from "@/components/Card"
import Homecards from "@/components/Homecards"
import useHomestore from "@/store/homestore"
import Loadingscrenn from "@/components/Loadingscreen"
import useProfilestore from "@/store/profilestore"
import Trending from "@/components/Trending"
import Pa from "@/components/Pa"
import Recom from "@/components/Recom"
import Sblogs from "@/components/Sblogs"
import Editorpicks from "@/components/Editorpicks"


export default function Home() {
    const { logout, setshownav, user, shownav } = useAuthstore()
    const { fetchinfo, h, fetcht, trendingblogs, fetchpa, pa, searchedblog, recomdations, search, fetchep, fetchr } = useHomestore();
    const { userinfo, fetchuser } = useProfilestore()
    const [width, setwidth] = useState(window.innerWidth)
    const [searchtext, setsearchtext] = useState("")



    console.log(recomdations);
    const searchb = async () => {
        setloading(true)
        try {
            if (searchtext) {
                await search(searchtext)

            }


        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }



    useEffect(() => {
        const handlesize = () => setwidth(window.innerWidth)
        window.addEventListener("resize", handlesize)

        return () => window.removeEventListener("resize", handlesize)
    }, [])


    const [loading, setloading] = useState(false)
    const navigate = useNavigate()

    const fetchl = async () => {
        setloading(true)
        try {
            await fetchinfo()
            await fetchuser()
            await fetcht()
            await fetchpa()
            await fetchr()
            await fetchep()
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        fetchl()

    }, [])




    if (loading) return <Loadingscrenn />
    return (

        <div className="  relative bg-base-100 ">
            <Sidebar />





            <div className="space-y-6">


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





                <div className="relative">

                    {
                        width >= 1528 && (
                            <Trending />
                        )
                    }

                    {
                        width >= 1528 && (
                            <Pa />
                        )
                    }

                    {
                        width >= 1528 && recomdations?.length > 0 && (
                            <Recom />
                        )
                    }

                    {
                        width >= 1528 && (
                            <Editorpicks />
                        )
                    }
                    <Homecards />

                </div>








            </div>




        </div>
    )
}