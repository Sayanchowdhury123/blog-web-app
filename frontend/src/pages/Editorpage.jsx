import useEditorstore from "@/store/editorstore"
import { useEffect } from "react";


export default function Editorpage(){
const {fetchall} = useEditorstore();

useEffect(() => {
  fetchall()
},[])



    return(
        <div>

        </div>
    )
}