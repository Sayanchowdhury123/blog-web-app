import useAuthstore from "../store/authstore"


export default function Home(){
 const {logout} = useAuthstore()
    return(
        <div className="h-screen w-full p-8">
            
            <div className="flex items-center justify-between" >
                <h1 className="text-4xl font-semibold">Blogs</h1>
                <button className="btn btn-error" onClick={logout}>logout</button>
            </div>
            
            </div>
    )
}