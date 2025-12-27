import api from "@/axios";
import Loadingscrenn from "@/components/Loadingscreen";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Writeranalytics from "@/components/Writeranalytics";
import useAuthstore from "@/store/authstore";
import useProfilestore from "@/store/profilestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export default function Analytics() {
    const navigate = useNavigate()
    const { logout, setshownav, user, shownav } = useAuthstore()
    const { userinfo, fetchuser } = useProfilestore()
    const [wdata, setwdata] = useState([])
    const [pb, setpb] = useState([])
    const [pa, setpa] = useState([])
    const [loading, setloading] = useState(false)
    const[edata,setedata] = useState({})
    const[editinfo,seteditinfo] = useState([])
  

    useEffect(() => {
      
        fetchdata()
        popularblogs()
        postanalytics()
        if(user?.role === "editor"){
            getapprovalrate()
            geteditinfo()
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
         toast.error(error.response?.data?.msg || "Something went wrong");

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
            toast.error(error.response?.data?.msg || "Something went wrong");

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
            toast.error(error.response?.data?.msg || "Something went wrong");

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
       
            setedata(res.data)
        } catch (error) {
           
            toast.error(error.response?.data?.msg || "Something went wrong");
        } finally {
            setloading(false)
        }
    }

  const geteditinfo = async () => {
        setloading(true)
        try {
            const res = await api.get(`/ea/edit-info`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            
            seteditinfo(res.data)
        } catch (error) {
             toast.error(error.response?.data?.msg || "Something went wrong");
        } finally {
            setloading(false)
        }
    }

    

    if (loading) return <Loadingscrenn />
    return (

        <div className="  relative bg-base-100 ">
            <Sidebar />


            <div className="space-y-6">


                <Navbar/>

                <Writeranalytics data={wdata} popularblogs={pb} postanalytics={pa}  editordata={edata} editinfo={editinfo} />



            </div>

        </div>


    )

}

