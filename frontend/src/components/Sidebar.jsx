import { motion } from "framer-motion"
import useAuthstore from "../store/authstore"
import { IoIosClose } from "react-icons/io";
import { ImBlog } from "react-icons/im";
import { FaUser } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { IoSaveSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IoMdCreate } from "react-icons/io";
import { IoLogOutSharp } from "react-icons/io5";
import { FaUserEdit } from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate()
  const { shownav, user, setshownav, logout } = useAuthstore()
   console.log(shownav);

  return (
    <motion.div initial={{opacity:0 }} animate={{ opacity:  shownav ? 1 : 0 }} transition={{ duration: 0.3, type:"spring", stiffness:100 }} className={`bg-base-200 p-4   w-[300px] h-screen z-50 absolute right-0  `}>
      <div className=" flex justify-between   mb-6">
        <div className="flex  items-center gap-2">
          <img src="ff" alt="jj" className="w-8 h-8 bg-black rounded-full" />
          <div>
            <p className="font-bold">{user.name}</p>
            <p className="font-semibold text-sm">{user.email}</p>
          </div>
        </div>
        <div className="">
          <IoIosClose className="text-3xl" onClick={setshownav} />
        </div>


      </div>

      <hr />

      <div className="mt-4 space-y-2 cursor-pointer font-semibold text-sm">
        {user.role === "writer" || user.role === "editor" ? (
          <div className="flex items-center gap-2" onClick={(e) => {
               e.stopPropagation()
            navigate("/yourblogs")
            setshownav()
          }} >
            <ImBlog />
            <p>Your blogs</p>
          </div>
        ) : ""}

        {user.role === "writer" || user.role === "editor" ? (
          <div className="flex items-center gap-2" onClick={(e) => {
            e.stopPropagation()
            navigate("/create-blogs")
            setshownav()
          }} >
            <IoMdCreate />
            <p>Create blogs</p>
          </div>
        ) : ""}


        <div className="flex items-center gap-2">
          <FaUserCircle />
          <p>Profile</p>
        </div>

        <div className="flex items-center gap-2">
          <IoSaveSharp />
          <p>Saved blogs</p>
        </div>

        <div className="flex items-center gap-2">
          <IoLogOutSharp/>
          <button onClick={logout}>logout</button>
        </div>

        { user.role === "editor" ? (
          <div className="flex items-center gap-2" onClick={(e) => {
               e.stopPropagation()
            navigate("/editor-page")
            setshownav()
          }} >
            <FaUserEdit/>
            <p>Editor</p>
          </div>
        ) : ""}

      </div>
    </motion.div>
  )
}