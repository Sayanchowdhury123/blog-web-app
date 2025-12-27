import api from "@/axios";
import Blog from "@/components/Blog";
import Loadingscrenn from "@/components/Loadingscreen";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import useAuthstore from "@/store/authstore";
import useProfilestore from "@/store/profilestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";


export default function Reviewpage() {
    const { setshownav } = useAuthstore()
    const [loading, setloading] = useState(false)
    const [blog, setblog] = useState([])

    const { blogid } = useParams();
    const { user } = useAuthstore()
    const navigate = useNavigate()
    const [viewed, setviewed] = useState(false)
    const { fetchuser, userinfo } = useProfilestore()
    const [eid, seteid] = useState("")


    const fb = async () => {

        try {
            setloading(true)
            const res = await api.get(`/blogs/${blogid}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            })
            setblog(res.data)


        } catch (error) {
             toast.error(error.response?.data?.msg || "Something went wrong");
        } finally {
            setloading(false)
        }
    }


    const blogreviewd = async () => {
        try {
            const res = await api.post(`/ea/reviewed`, { blogid: blogid }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            })
            
         
        } catch (error) {
         toast.error(error.response?.data?.msg || "Something went wrong");
        }
    }



    useEffect(() => {
        fb()
        
        blogreviewd()

    }, [])





    if (loading) return <Loadingscrenn />


    return (
        <div className="relative">
            <Sidebar />
            <div className=" ">
<Navbar/>

                <Blog blog={blog} />

            </div>

        </div>
    )
}