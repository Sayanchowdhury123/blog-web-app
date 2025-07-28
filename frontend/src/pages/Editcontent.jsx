import Customeditor from '@/components/Customeditor'
import Sidebar from '@/components/Sidebar'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import useAuthstore from '@/store/authstore'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
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

const extensions = [
  BaseKit, Blockquote, Bold, CodeBlock, BulletList, Color, Clear, Code, Document, Strike, Heading, Highlight, ListItem, Link, FontFamily, FontSize, Selection, Italic, TextAlign, SubAndSuperScript, SlashCommand, TextUnderline, OrderedList, LineHeight


]

export default function Editcontent() {
  const location = useLocation()
  const [blogtext, setblogtext] = useState(location.state?.t || "")

  const { setshownav } = useAuthstore()






  const handlesubmit = (e) => {
    e.preventDefault()

    const formdata = new FormData()
    formdata.append("blogtext", blogtext)
    console.log(blogtext);


  }

  return (
    <div className="  relative  overflow-x-hidden">
      <Sidebar />
      <div className='p-4 space-y-4'>
        <div className="flex items-center justify-between " >
          <h1 className="text-4xl font-bold">  BlogApp</h1>
          <img src="jj" alt="img" className="w-8 h-8 bg-black rounded-full" onClick={setshownav} />
        </div>

        <div>
          <h1 className="text-3xl text-center font-semibold">Edit Content</h1>
        </div>

        <div className='flex justify-center items-center   '>
          <form onSubmit={handlesubmit} className="w-[984px]" >
            <RichTextEditor extensions={extensions} output='html' content={blogtext} onChangeContent={setblogtext}  />
            <button type='submit' className='btn btn-neutral mt-2'>Submit</button>
          </form>

        </div>

      </div>



    </div>

  )
}