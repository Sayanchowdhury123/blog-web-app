import Fblogs from "@/components/Fblogs";
import Loadingscrenn from "@/components/Loadingscreen";
import Sidebar from "@/components/Sidebar";
import useAuthstore from "@/store/authstore";
import useFpagestore from "@/store/fapagestore"
import useProfilestore from "@/store/profilestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Sf from "@/components/Sf";
import Sfollowing from "@/components/Sfollowing";

export default function Followerpage() {

    const { fetchuserinfo, userinfo, blogs, fu, showfollowers, setshowfollowers, getfinfo, followerinfo, showfollowing, setshowfollowing } = useFpagestore();
    const { fetchuser, ui } = useProfilestore()
    const { userid } = useParams()
    const { user } = useAuthstore()
    const { setshownav } = useAuthstore()
    const navigate = useNavigate()
    const [loading, setloading] = useState(false)



    const fetch = async () => {
        setloading(true)
        try {
            await fetchuserinfo(userid)
            await fetchuser()
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }

    const followunfollow = async () => {
        try {
            await fu(userid)
            await fetchuserinfo(userid)
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



    useEffect(() => {
        fetch()
    }, [userid])


    const getfollowerinfo = async (followerid) => {
        try {

            setshowfollowers()
            if (followerid) {
                await getfinfo(followerid)
            }



        } catch (error) {
            console.log(error);
        }
    }

    const getfollowinginfo = async (followerid) => {
        try {

            setshowfollowing()
            if (followerid) {
                await getfinfo(followerid)
            }



        } catch (error) {
            console.log(error);
        }
    }




    if (loading) return <Loadingscrenn />

    return (


        <div className="relative">
            <Sidebar />


            {
                showfollowers && (
                    <Sf />
                )
            }

            {
                showfollowing && (
                    <Sfollowing />
                )
            }


            <div className="">
                <div className="flex items-center justify-between sticky top-0  shadow p-4 bg-white z-20 " onClick={(e) => {
                    e.stopPropagation()
                    setshownav
                }}>
                    <h1 className="text-4xl font-bold" onClick={(e) => {
                        e.stopPropagation()
                        navigate("/home")
                    }}>  BlogApp</h1>
                    <img src={ui.profilepic} alt="img" className="w-8 h-8 bg-black rounded-full" />
                </div>



                <div className="px-4 py-8">

                    <div className="flex flex-col items-center sm:flex sm:flex-row  justify-center gap-4 sm:gap-16 ">
                        <div className="">
                            <motion.img initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 100 }}
                                src={userinfo?.profilepic} alt="profilepic" className="border-4 border-blue-500  h-40 w-40 object-center   rounded-full" />
                        </div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6  text-center sm:text-left">
                            <p className="text-2xl font-semibold ">{userinfo.name}</p>
                            <div className="flex items-center gap-6">
                                <p className="text-lg font-bold">{blogs?.length || 0} <span className="block sm:inline text-md text-gray-400">posts</span></p>
                                <p className="text-lg font-bold" onClick={() => getfollowerinfo(userinfo._id)}>{userinfo?.followers?.length || 0} <span className="block sm:inline  text-md text-gray-400">followers</span></p>
                                <p className="text-lg font-bold" onClick={() => getfollowinginfo(userinfo._id)} >{userinfo?.following?.length || 0} <span className="block sm:inline text-md text-gray-400">following</span></p>
                            </div>
                            {user.id === userid ? "" : (
                                <div>
                                    {userinfo?.followers?.includes(user.id) ? (<button className="bg-blue-500 font-semibold text-white px-2 py-2 rounded-lg w-full" onClick={followunfollow} >unfollow</button>) : (<button className="bg-blue-500 font-semibold text-white px-2 py-2 rounded-lg w-full" onClick={followunfollow} >Follow</button>)}
                                </div>
                            )}


                        </motion.div>


                    </div>





                </div>


              {
                blogs?.length > 0 ? (
                   <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
                    {blogs?.map((b, i) => (
                        <Fblogs b={b} i={i} key={i} />
                    ))}
                </div>
                ) : (
                    <div className="flex justify-center text-xl font-semibold mt-10">
                        No Blogs Posted Yet
                    </div>
                )
              }
                



            </div>

        </div>





    )
}