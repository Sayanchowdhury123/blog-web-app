import api from "@/axios";
import Loadingscrenn from "@/components/Loadingscreen";
import Sidebar from "@/components/Sidebar";
import Writeranalytics from "@/components/Writeranalytics";
import useAuthstore from "@/store/authstore";
import useProfilestore from "@/store/profilestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Analytics() {
    const navigate = useNavigate()
    const { logout, setshownav, user, shownav } = useAuthstore()
    const { userinfo, fetchuser } = useProfilestore()
    const [wdata, setwdata] = useState([])
    const [pb, setpb] = useState([])
    const [pa, setpa] = useState([])
    const [loading, setloading] = useState(false)
  

    useEffect(() => {
        fetchuser()
        fetchdata()
        popularblogs()
        postanalytics()
        if(user.role === "editor"){
            getapprovalrate()
        }
    }, [])


    const fetchdata = async () => {
        setloading(true)
        try {

            const res = await api.get(`/writers`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            setwdata(res.data)

        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }

    const popularblogs = async () => {
        setloading(true)
        try {
            const res = await api.get(`/writers/popular`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            setpb(res.data)
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }

    const postanalytics = async () => {
        setloading(true)
        try {
            const res = await api.get(`/writers/post-analytics`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            setpa(res.data)
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }

  const getapprovalrate = async () => {
        setloading(true)
        try {
            const res = await api.get(`/ea/approval-rate`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            console.log(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }


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

                            setshownav()
                        }} />
                    </div>

                </div>


                <Writeranalytics data={wdata} popularblogs={pb} postanalytics={pa} />



            </div>

        </div>


    )

}

