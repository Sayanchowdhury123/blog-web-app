import Card from "@/components/Card";
import Collabcard from "@/components/Collabcard";
import Loading2 from "@/components/Loadin2";
import Loadingscrenn from "@/components/Loadingscreen";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import useAuthstore from "@/store/authstore";
import useEditorstore from "@/store/editorstore"
import useProfilestore from "@/store/profilestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useActionData, useNavigate } from "react-router-dom";


export default function Collabpage() {
  const { fetchall, blogs } = useEditorstore();
  const { setshownav, user } = useAuthstore()
  const [loading, setloading] = useState(false)
  const navigate = useNavigate()
  const { fetchuser, userinfo } = useProfilestore()

  const fetchl = async () => {
    setloading(true)
    try {
      await fetchall()
    } catch (error) {
       toast.error(error.response?.data?.msg || "Something went wrong");
    } finally {
      setloading(false)
    }
  }


  useEffect(() => {

    fetchl()
    
  }, [])



  if (loading) return <Loadingscrenn />

  return (
    <div className="relative">
      <Sidebar />

      <div className=" space-y-6 ">

        <Navbar />



        <div>
          <h1 className="text-3xl text-center font-semibold">Collaborate With Others</h1>
        </div>

        <Collabcard />
      </div>
    </div>
  )
}
