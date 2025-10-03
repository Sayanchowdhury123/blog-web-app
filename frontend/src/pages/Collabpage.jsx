import Card from "@/components/Card";
import Collabcard from "@/components/Collabcard";
import Loading2 from "@/components/Loadin2";
import Loadingscrenn from "@/components/Loadingscreen";
import Sidebar from "@/components/Sidebar";
import useAuthstore from "@/store/authstore";
import useEditorstore from "@/store/editorstore"
import useProfilestore from "@/store/profilestore";
import { useEffect, useState } from "react";
import { useActionData, useNavigate } from "react-router-dom";


export default function Collabpage() {
  const { fetchall, blogs } = useEditorstore();
  const { setshownav, user } = useAuthstore()
  const [loading, setloading] = useState(false)
  const navigate = useNavigate()
   const {fetchuser,userinfo} = useProfilestore()

  const fetchl = async () => {
    setloading(true)
    try {
      await fetchall()
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false)
    }
  }


  useEffect(() => {

    fetchl()
    fetchuser()
  }, [])



  if (loading) return <Loadingscrenn />

  return (
    <div className="relative">
      <Sidebar />

      <div className=" space-y-6 ">

        <div className="flex items-center justify-between sticky top-0  shadow p-4 bg-white z-20 " onClick={(e) => {
          e.stopPropagation()
          setshownav
        }}>
          <h1 className="text-4xl font-bold cursor-pointer" onClick={(e) => {
            e.stopPropagation()
            navigate("/home")
          }}>  BlogApp</h1>
          <img src={userinfo.profilepic} alt="img" className="w-8 h-8 bg-black rounded-full" />
        </div>



        <div>
          <h1 className="text-3xl text-center font-semibold">Collaborate With Others</h1>
        </div>

        <Collabcard/>
      </div>
    </div>
  )
}
