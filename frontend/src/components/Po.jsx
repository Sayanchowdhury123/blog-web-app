
import useAuthstore from "@/store/authstore"
import useFpagestore from "@/store/fapagestore"
import useProfilestore from "@/store/profilestore"
import { motion } from "framer-motion"
import { IoIosClose } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import { MdEmail } from "react-icons/md";
import { MdOutlinePassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";


export default function Po(){
const {setshowfollowers,followerinfo,fu,userinfo,setshowfollowing} = useFpagestore()
const {setboxopen,setupdatebox} = useProfilestore()
const {user} = useAuthstore()
const navigate = useNavigate()
  
 return(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}  className="z-20 backdrop-blur-sm inset-0 fixed flex justify-center items-center">
        <div className="bg-base-200 w-[400px] h-[400px]  rounded-xl space-y-4">
            <div className="flex justify-between items-center px-6 pt-6">
                <h1 className="text-center font-semibold text-xl "> Profile Setting</h1>
                 <div className="">
                          <IoIosClose className="text-3xl" onClick={setboxopen} />
                </div>
            </div>

            <div className="flex flex-col gap-4  cursor-pointer">
                <div className="px-6 py-4 flex items-center gap-2 hover:bg-base-100" onClick={() => {
                    setboxopen()
                    setupdatebox("email")
                }}   ><MdEmail/>Update Email</div>
                <div className="px-6 py-4 flex items-center gap-2 hover:bg-base-100" onClick={() => {
                    setboxopen()
                    setupdatebox("pass")
                }}  > <MdOutlinePassword/> Password</div>
                <div className="px-6 py-4 flex items-center gap-2 hover:bg-base-100"  onClick={() => {
                    setboxopen()
                    setupdatebox("del")
                }}  ><FaUser/>Delete Profile</div>
            </div>
         

          
        </div>
    
    </motion.div>
 )
}