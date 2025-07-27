import Customeditor from '@/components/Customeditor'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import useAuthstore from '@/store/authstore'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function Editcontent() {
 const location = useLocation()
const [blogtext,setblogtext] = useState(location.state?.t || "")








const handlesubmit = (e) => {
    e.preventDefault()
    
    const formdata = new FormData()
    formdata.append("blogtext", blogtext)
    console.log(blogtext);
    
    
}

  return(
    <div >
      <form onSubmit={handlesubmit} >
        <Customeditor intialContent={blogtext} onContentChange={setblogtext}/>
        <button type='submit'>Submit</button>
      </form>
      

    </div>
 
  ) 
}