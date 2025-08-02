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
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-text-style";
import { FontSize } from "@tiptap/extension-text-style";
import { HiListBullet } from "react-icons/hi2";
import { GoListOrdered } from "react-icons/go";
import { FaGripLines } from "react-icons/fa";
import { LuUndo2 } from "react-icons/lu";
import { LuRedo2 } from "react-icons/lu";
import { Undo2Icon } from "./tiptap-icons/undo2-icon";
import { Redo2Icon } from "./tiptap-icons/redo2-icon";
import { BoldIcon } from "./tiptap-icons/bold-icon";
import { ItalicIcon } from "./tiptap-icons/italic-icon";
import { StrikeIcon } from "./tiptap-icons/strike-icon";
import { Code2Icon } from "./tiptap-icons/code2-icon";
import { UnderlineIcon } from "./tiptap-icons/underline-icon";
import { RiListOrdered2 } from "react-icons/ri";


export default function Customeditor({ intialContent = "", onContentChange }) {
  const [content, setcontent] = useState(intialContent)
  const [h, seth] = useState(1)


  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      FontSize

    ],
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
      <div className="flex gap-3 p-4">
        <button type="button" onClick={() => {
          editor.chain().focus().toggleBold().run()
        }}  >
          <BoldIcon  className={editor.isActive("bold") ? "text-blue-500" : ""} />
        </button>

        <button type="button" onClick={() => {
          editor.chain().focus().toggleItalic().run()

        }} >
          <ItalicIcon  className={editor.isActive("italic") ? "text-blue-500" : ""} />
        </button>

        <button type="button" onClick={() => {
          editor.chain().focus().toggleStrike().run()

        }} >
          < StrikeIcon  className={editor.isActive("strike") ? "text-blue-500" : ""} />
        </button>


        <button type="button" onClick={() => {
          editor.chain().focus().toggleCode().run()

        }} >
          < Code2Icon  className={editor.isActive("code") ? "text-blue-500" : ""} />
        </button>

        <button type="button" onClick={() => {
          editor.chain().focus().toggleUnderline().run()

        }} >
          < UnderlineIcon  className={editor.isActive("underline") ? "text-blue-500" : ""}/>
        </button>


        <select name="" id=""  onChange={(e) => {
          const level = Number(e.target.value)
          if(level === 0){
            editor.chain().focus().setParagraph().run()
          }else{
            editor.chain().focus().toggleHeading({ level: level }).run()
          }

        }} value={
          editor.isActive("heading",{
            level:1 }) ? "1" :  editor.isActive("heading",{
            level:2 }) ? "2" :  editor.isActive("heading",{
            level:3 }) ? "3":  editor.isActive("heading",{
            level:4 }) ? "4" :  editor.isActive("heading",{
            level:5 }) ? "5" :  editor.isActive("heading",{
            level:6 }) ? "6" : "0"
            }>
           <option value="0">Normal</option>   
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">H4</option>
          <option value="5">H5</option>
          <option value="6">H6</option>
        </select>

        

        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <HiListBullet className={editor.isActive("bulletList") ? "text-blue-500" : ""} />
        </button>

        <button type="button" onClick={() => editor.chain().focus().setHardBreak().run()}>
          Line Break
        </button>

        <button type="button" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2Icon/>
        </button>

        <button type="button" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2Icon/>
        </button>

        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        < RiListOrdered2  />
        </button>

        <select name="" id="" onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          value={editor.getAttributes("textStyle").fontFamily || "Arial"}
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
          <option value="monospace">Monospace</option>
          <option value="Serif">Serif</option>
          <option value="cursive">Cursive</option>
        </select>

        <select name="" id="" onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          value={editor.getAttributes("textStyle").fontSize || "16px"}
        >
          <option value="12px">small</option>
          <option value="16px">Normal</option>
          <option value="20px">Large</option>
          <option value="24px">X-Large</option>
        </select>




      </div>
    )
  }

  return (

    <EditorContext.Provider value={{ editor }}>
      <div className="h-[70vh] border rounded-xl ">
       <div className="border-b ">
        <Toolbar1 />
      </div>

      <EditorContent editor={editor} className="p-4" />

      </div>
      

    </EditorContext.Provider>
  )
}