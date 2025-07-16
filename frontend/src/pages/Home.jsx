import useAuthstore from "../store/authstore"


export default function Home(){
 const {logout} = useAuthstore()
    return(
        <div>
            
            home
            <button className="bg-red-500" onClick={logout}>logout</button>
            </div>
    )
}