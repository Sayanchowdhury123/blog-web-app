import useHomestore from "@/store/homestore"
import { useEffect, useState } from "react"


export default function Comments({ id }) {
    const [text, settext] = useState("")
    const { addcomment, rendercomment, comments, comid, hasmore } = useHomestore()
    const [loading, setloading] = useState(true)

    console.log(id);

    const ac = async () => {

        try {
            if (text && comid) {
                await addcomment(comid, text)
            }

            settext("")

        } catch (error) {
            console.log(error);
        }
    }

    const fetchcom = async () => {
        setloading(true)
        try {
            if(comid){
                await rendercomment(comid)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        fetchcom()
    }, [])

    return (
        <div className="">
            <div>
                <input type="text" className="input " onChange={(e) => settext(e.target.value)} value={text} required />
                <button type="submit" className="btn btn-sm" onClick={ac}>Comment</button>
            </div>

    
                    <div>
                        {
                            comments?.map((c) => (
                                <div className="" key={c._id}>
                                    <p>{c.text}</p>
                                </div>
                            ))
                        }
                    </div>
                    




            {
                hasmore && (
                    <div>
                        <button className="btn" onClick={() => fetchcom()}>Load more</button>
                    </div>
                )
            }


        </div>
    )
}