import Fblogs from "@/components/Fblogs";
import Loadingscrenn from "@/components/Loadingscreen";
import Sidebar from "@/components/Sidebar";
import useAuthstore from "@/store/authstore";
import useFpagestore from "@/store/fapagestore"
import useProfilestore from "@/store/profilestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";


export default function Followerpage() {

    const { fetchuserinfo, userinfo, blogs, fu } = useFpagestore();
    const { fetchuser, ui } = useProfilestore()
    const { userid } = useParams()
    const { user } = useAuthstore()
    const {setshownav} = useAuthstore()
    const navigate = useNavigate()
    const [loading,setloading] = useState(false)


    const fetch = async () => {
        setloading(true)
        try {
            await fetchuserinfo(userid)
            await fetchuser()
        } catch (error) {
            console.log(error);
        }finally{
            setloading(false)
        }
    }




    useEffect(() => {
        fetch()
    }, [])


if(loading) return <Loadingscrenn/>

    return (


        <div className="relative">
            <Sidebar/>
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



                <div className="p-4">
                    <img src={userinfo?.profilepic} alt="profilepic" className="w-40 h-40  rounded-full" />
                    <div>{userinfo.name}</div>
                    <div>
                        <p>{blogs?.length || 0} posts</p>
                        <p>{userinfo?.followers?.length || 0} followers</p>
                        <p>{userinfo?.following?.length || 0} following</p>
                    </div>


                    {userinfo?.followers?.includes(user.id) ? (<button className="btn" onClick={() => fu(userid)} >unfollow</button>) : (<button className="btn" onClick={() => fu(userid)} >Follow</button>)}

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {blogs?.map((b,i) => (
                        <Fblogs b={b} i={i} />
                    ))}
                </div>



            </div>

        </div>





    )
}