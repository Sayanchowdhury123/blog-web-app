import Customeditor from '@/components/Customeditor'
import Sidebar from '@/components/Sidebar'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import useAuthstore from '@/store/authstore'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import RichTextEditor from 'reactjs-tiptap-editor';
import { BaseKit } from 'reactjs-tiptap-editor';
import 'reactjs-tiptap-editor/style.css';
import { Blockquote } from 'reactjs-tiptap-editor/blockquote';
import { Bold } from 'reactjs-tiptap-editor/bold';
import { CodeBlock } from 'reactjs-tiptap-editor/codeblock';
import 'prism-code-editor-lightweight/layout.css';
import 'prism-code-editor-lightweight/themes/github-dark.css';
import { BulletList } from 'reactjs-tiptap-editor/bulletlist';
import { Color } from 'reactjs-tiptap-editor/color';
import { Clear } from 'reactjs-tiptap-editor/clear';
import { Code } from 'reactjs-tiptap-editor/code';
import { Document } from 'reactjs-tiptap-editor/document';
import { Strike } from 'reactjs-tiptap-editor/strike';
import { Heading } from 'reactjs-tiptap-editor/heading';
import { Highlight } from 'reactjs-tiptap-editor/highlight';
import { ListItem } from 'reactjs-tiptap-editor/listitem';
import { Link } from 'reactjs-tiptap-editor/link';
import { FontFamily } from 'reactjs-tiptap-editor/fontfamily';
import { FontSize } from 'reactjs-tiptap-editor/fontsize';
import { Selection } from 'reactjs-tiptap-editor/selection';
import { Italic } from 'reactjs-tiptap-editor/italic';
import { TextAlign } from 'reactjs-tiptap-editor/textalign';
import { SubAndSuperScript } from 'reactjs-tiptap-editor/subandsuperscript';
import { SlashCommand } from 'reactjs-tiptap-editor/slashcommand';
import { TextUnderline } from 'reactjs-tiptap-editor/textunderline';
import { OrderedList } from 'reactjs-tiptap-editor/orderedlist';
import { LineHeight } from 'reactjs-tiptap-editor/lineheight';
import Loading2 from '@/components/Loadin2'
import api from '@/axios'
import toast from 'react-hot-toast'



const extensions = [
  BaseKit, Blockquote, Bold, CodeBlock, BulletList, Color, Clear, Code, Strike, Heading, Highlight,
  Link, FontFamily, FontSize, Italic, TextAlign, SubAndSuperScript, SlashCommand, TextUnderline, OrderedList, LineHeight

]

export default function Editcontent() {
  const { user } = useAuthstore()
  const location = useLocation()
  const { t ,editor} = location.state || {};
  const [blogtext, setblogtext] = useState(t?.blogtext || "")
  const [l, setl] = useState(false)
  const navigate = useNavigate()
  const { setshownav } = useAuthstore()






 const handlesubmit = async (e) => {
    e.preventDefault()
    setl(true)



    
    try {

      const res = await api.patch(`/blogs/${t._id}/edit-content`, { blogtext: blogtext }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data"

        }
      })



      toast('Content Updation successful',
        {
          icon: '🎉',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        })

      if(editor){
      navigate(`/editor-page`)
      }else{
        navigate(`/yourblogs`)
      }
      


    } catch (error) {
      console.log(error);
      toast('Content updation failed',
        {
          icon: '❌',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        })
    } finally {
      setl(false)
    }
  }

  if(l) return <Loading2/>

  return (
    <div className="  relative ">
     


      <Sidebar />
      <div className=' space-y-4'>

        <div className="flex items-center justify-between sticky top-0  shadow p-4 bg-white z-20 " onClick={(e) => {
          e.stopPropagation()
          setshownav
        }}>
          <h1 className="text-4xl font-bold" onClick={(e) => {
            e.stopPropagation()
            navigate("/home")
          }}>  BlogApp</h1>
          <img src="jj" alt="img" className="w-8 h-8 bg-black rounded-full" />
        </div>
        <div className=''>
          <h1 className="text-3xl text-center font-semibold">Edit Content</h1>
        </div>

        <div className='flex justify-center items-center  p-4 '>
          <form onSubmit={handlesubmit} className=" relative" >
            <Customeditor intialContent={blogtext} onContentChange={setblogtext} />
            <button type='submit' className='btn btn-neutral mt-4'>Submit</button>
          </form>

        </div>

      </div>



    </div>

  )
}