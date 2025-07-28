import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect, useState } from "react"
import { FaBold } from "react-icons/fa";
import { FaItalic } from "react-icons/fa";
import { FaStrikethrough } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import { FaUnderline } from "react-icons/fa";
import { BsBlockquoteRight } from "react-icons/bs";
import { BlockquoteButton } from "./tiptap-ui/blockquote-button";
import { ToolbarGroup } from "./tiptap-ui-primitive/toolbar";
import { HeadingDropdownMenu } from "./tiptap-ui/heading-dropdown-menu";
import { Toolbar } from "./tiptap-ui-primitive/toolbar";

export default function Customeditor({ intialContent = "", onContentChange }) {
  const [content, setcontent] = useState(intialContent)
  const [toggle, settoggle] = useState(true)

  const editor = useEditor({
    extensions: [StarterKit],
    content: intialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setcontent(html)
      if (onContentChange) {
        onContentChange(html)
      }
    }
  })


  useEffect(() => {
    if (editor && intialContent !== editor.getHTML() && intialContent) {
      editor.commands.setContent(intialContent)
    }
  }, [intialContent, editor])

  function Toolbar1() {
    if (!editor) return null;
    return (
      <div className="flex gap-3 mb-4">
        <button type="button" onClick={() => {
          editor.chain().focus().toggleBold().run()
        }} className={editor.isActive("bold") ? "font-bold" : ""} >
          <FaBold/>
        </button>

        <button type="button" onClick={() => {
          editor.chain().focus().toggleItalic().run()
          settoggle((prev) => !prev)
        }} >
          <FaItalic />
        </button>

        <button type="button" onClick={() => {
          editor.chain().focus().toggleStrike().run()
          settoggle((prev) => !prev)
        }} >
          <FaStrikethrough />
        </button>


        <button type="button" onClick={() => {
          editor.chain().focus().toggleCode().run()
          settoggle((prev) => !prev)
        }} >
          <FaCode />
        </button>

        <button type="button" onClick={() => {
          editor.chain().focus().toggleUnderline().run()
          settoggle((prev) => !prev)
        }} >
          <FaUnderline />
        </button>






      </div>
    )
  }

  return (
    <EditorContext.Provider value={{editor}}>
      <div className="tiptap-toolbar-container">
      <Toolbar1/>
      </div>
     
      <EditorContent editor={editor} className="tiptap-editor-content" />


    </EditorContext.Provider>
  )
}