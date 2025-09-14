import useProfilestore from "@/store/profilestore"
import { motion } from "framer-motion"
import { useState } from "react"
import api from "@/axios"
import toast from "react-hot-toast"
import Loading2 from "./Loadin2"
import Loading3 from "./Loading3"
import useFpagestore from "@/store/fapagestore"
import { useParams } from "react-router-dom"

export default function Editprofile() {
        const { setshowedit, editp ,userinfo,showedit} = useProfilestore()
    const [name, setname] = useState(userinfo.name)
    const [profilepic, setpic] = useState(userinfo.profilepic)
const { fetchuserinfo } = useFpagestore()
    const { fetchuser, ui } = useProfilestore()
    const [l, setl] = useState(false)
    const {userid} = useParams()

    const handlefile = (e) => {
        const ci = e.target.files[0]
        setpic(ci)

    }

    const ep = async () => {
        setl(true)
        const formdata = new FormData()
        formdata.append("name", name)
        formdata.append("profilepic", profilepic)

        try {

            if (formdata) {
                await editp(formdata)
                await fetchuserinfo(userid)
                
                toast('Profile Updated',
                    {
                        icon: '🎉',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    })

                setshowedit()
            }



        } catch (error) {
            console.log(error);
            toast('Profile updation failed',
                {
                    icon: '❌',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                })
        } finally {
            setl(false)
        }
    }

    if (l) return <Loading3 />

    return (

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="  z-20 backdrop-blur-sm inset-0 fixed flex justify-center items-center ">




            <div className="bg-base-200  p-6 w-3xl shadow-lg rounded-xl space-y-6 ">

                <div>
                    <h1 className="text-3xl font-bold">Edit Profile</h1>
                </div>

                <div className="">
                    <label htmlFor="b" className="label mb-2">
                        <span className="label-text font-semibold">Name</span>
                    </label>
                    <input type="text" id="b" className="input w-full" placeholder="Add Name" required onChange={(e) => setname(e.target.value)} value={name} />

                </div>



                <div className="">
                    <label htmlFor="f" className="label mb-2">
                        <span className="label-text font-semibold">Profile Picture</span>
                    </label>
                   
                    <img src={userinfo.profilepic} className="w-30 rounded-full mb-2" alt="profile pic" />
                    <input type="file" id="f" className="file-input w-full" onChange={handlefile} required />
                </div>




                <div className=" flex justify-end gap-2">
                    <button className="btn btn-primary" onClick={ep}>Edit</button>
                    <button className="btn btn-error" onClick={setshowedit}>Cancel</button>
                </div>

            </div>
        </motion.div>
    )
}