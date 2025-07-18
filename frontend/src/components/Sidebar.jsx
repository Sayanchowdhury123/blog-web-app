import { motion } from "framer-motion"
import useAuthstore from "../store/authstore"
import { IoIosClose } from "react-icons/io";
import { ImBlog } from "react-icons/im";
import { FaUser } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { IoSaveSharp } from "react-icons/io5";


export default function Sidebar() {

    const { shownav, user, setshownav, logout } = useAuthstore()
    console.log(user);

    return (
        <motion.div initial={{x: "100%" }} animate={{x: shownav ? 0 : "100%"}} transition={{duration: 0.3, ease:"easeInOut"}} className={`bg-base-200 p-4   w-[300px] h-screen z-100 absolute right-0 `}>
            <div className="flex justify-between mb-6 ">
                <div className="flex items-center gap-2">
                    <img src="ff" alt="jj" className="w-8 h-8 bg-black rounded-full" />
                    <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="font-semibold text-sm">{user.email}</p>
                    </div>
                </div>
                <div>
                    <IoIosClose className="text-2xl" onClick={setshownav}/>
                </div>


            </div>

            <hr/>

            <div className="mt-4 space-y-2 cursor-pointer font-semibold text-sm">
                <div className="flex items-center gap-2" >
                   <ImBlog/>
                   <p>Your blogs</p>
                </div>

                <div className="flex items-center gap-2">
                  <FaUserCircle/>
                  <p>Profile</p>
                </div>

                 <div className="flex items-center gap-2">
                   <IoSaveSharp/>
                  <p>Saved blogs</p>
                </div>
                
                <div>
                     <button onClick={logout}>logout</button>
                </div>
             
            </div>
        </motion.div>
    )
}