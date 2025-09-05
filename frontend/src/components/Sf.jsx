import useAuthstore from "@/store/authstore"
import useFpagestore from "@/store/fapagestore"
import { motion } from "framer-motion"
import { IoIosClose } from "react-icons/io"
import { useNavigate } from "react-router-dom"

export default function Sf(){
const {setshowfollowers,followerinfo,fu,userinfo} = useFpagestore()
const {user} = useAuthstore()
const navigate = useNavigate()


    const followunfollow = async (fid) => {
        try {
            await fu(fid)
            toast(`${userinfo?.followers?.includes(user.id) ? `Unfollowed ${userinfo?.name}` : `Following ${userinfo?.name}`}`,
                {
                    icon: '🎉',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                })
        } catch (error) {
            toast('Content updation failed',
                {
                    icon: '❌',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                })
        }
    }

 return(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
     className="z-20 backdrop-blur-sm inset-0 fixed flex justify-center items-center">
        <div className="bg-base-200 w-[400px] h-[400px] p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-center font-semibold text-xl "> Followers</h1>
                 <div className="">
                          <IoIosClose className="text-3xl" onClick={setshowfollowers} />
                </div>
            </div>
         
            <div className="flex flex-col gap-4">
             {
                followerinfo?.followers?.map((f,i) => (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }}  key={f._id} className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/f-page/${f._id}`)}>
                     <img src={f.profilepic} alt="profilepic" className="w-8 h-8 border-2 border-blue-500 rounded-full" />
                     <p >{f.name}</p>
                 
                    </motion.div>
                ))
             }
            </div>
          
        </div>
    
    </motion.div>
 )
}