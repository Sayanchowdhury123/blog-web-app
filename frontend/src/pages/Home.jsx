import Sidebar from "../components/Sidebar"
import useAuthstore from "../store/authstore"


export default function Home(){
 const {logout,setshownav,user} = useAuthstore()
 console.log(localStorage.getItem("user"));
    return(
        
        <div className="h-screen  relative overflow-hidden">
            <Sidebar/>
            
            <div className="flex items-center justify-between py-4 px-4" >
                <h1 className="text-4xl font-semibold">Blogs</h1>
                <img src="jj" alt="img" className="w-8 h-8 bg-black rounded-full" onClick={setshownav}  />
            </div>

         
            
            </div>
    )
}