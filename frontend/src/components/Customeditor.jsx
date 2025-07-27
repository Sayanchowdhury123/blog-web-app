import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect, useState } from "react"



export default function Customeditor({intialContent="",onContentChange}) {
  const [content,setcontent] = useState(intialContent)

  const editor = useEditor({
    extensions: [StarterKit],
    content: intialContent,
    onUpdate: ({editor}) => {
        const html = editor.getHTML()
        setcontent(html)
        if(onContentChange){
            onContentChange(html)
        }
    }
  })


  useEffect(() => {
    if(editor && intialContent !== editor.getHTML() && intialContent){
        editor.commands.setContent(intialContent)
    }
  },[intialContent,editor])

    return(
        <div>
          <EditorContent editor={editor} />
        </div>
    )
}