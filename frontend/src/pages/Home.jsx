import Sidebar from "../components/Sidebar"
import useAuthstore from "../store/authstore"


export default function Home(){
 const {logout,setshownav,user} = useAuthstore()
 console.log(localStorage.getItem("user"));
    return(
        
        <div className="h-screen  relative overflow-hidden">
            <Sidebar/>
            
              <div className="flex items-center justify-between sticky top-0 py-4 shadow p-4 bg-white z-20 " onClick={setshownav}>
                    <h1 className="text-4xl font-bold">  BlogApp</h1>
                    <img src="jj" alt="img" className="w-8 h-8 bg-black rounded-full"  />
                </div>

         
            
            </div>
    )
}