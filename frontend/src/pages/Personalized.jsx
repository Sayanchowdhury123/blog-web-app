import Editorpicks from "@/components/Editorpicks";
import Navbar from "@/components/Navbar";
import Pa from "@/components/Pa";
import Recom from "@/components/Recom";
import Sidebar from "@/components/Sidebar";
import Trending from "@/components/Trending";
import useHomestore from "@/store/homestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export default function Personalized() {
    const { fetchinfo, h, fetcht, trendingblogs, fetchpa, pa, searchedblog, recomdations, search, fetchep, fetchr } = useHomestore();
    const [loading, setloading] = useState(false)


    // const fetchl = async () => {
    //     setloading(true)
    //     try {

    //         await fetchinfo()
    //         await fetcht()
    //         await fetchpa()
    //         await fetchr()
    //         await fetchep()

    //     } catch (error) {
    //         toast.error(error.response?.data?.msg || "Something went wrong");
    //     } finally {
    //         setloading(false)
    //     }
    // }

    // useEffect(() => {
    //     fetchl()

    // }, [])

    return (
        <div className="  relative bg-base-100 ">
            <Sidebar />


            <div className="">

                <Navbar />

                <div className='mt-5'>
                    <h1 className="text-3xl text-center font-semibold">Personalized</h1>
                </div>

                <div className="p-4 space-y-6">


                    <Trending page="per" />





                    <Pa page="per" />



                    {
                        recomdations?.length > 0 && (
                            <Recom page="per" />
                        )
                    }



                    <Editorpicks page="per" />



                </div>



            </div>

        </div>
    )
}