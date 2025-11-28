import { EditorContent, EditorContext, useEditor, Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect, useMemo, useRef, useState } from "react"

import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-text-style";
import { FontSize } from "@tiptap/extension-text-style";
import { HiListBullet } from "react-icons/hi2";

import { FaGripLines } from "react-icons/fa";

import { Undo2Icon } from "./tiptap-icons/undo2-icon";
import { Redo2Icon } from "./tiptap-icons/redo2-icon";
import { BoldIcon } from "./tiptap-icons/bold-icon";
import { ItalicIcon } from "./tiptap-icons/italic-icon";
import { StrikeIcon } from "./tiptap-icons/strike-icon";
import { Code2Icon } from "./tiptap-icons/code2-icon";
import { UnderlineIcon } from "./tiptap-icons/underline-icon";
import { RiListOrdered2 } from "react-icons/ri";
import TextAlign from "@tiptap/extension-text-align";
import { AlignLeftIcon } from "./tiptap-icons/align-left-icon";
import { AlignCenterIcon } from "./tiptap-icons/align-center-icon";
import { AlignRightIcon } from "./tiptap-icons/align-right-icon";
import Highlight from "@tiptap/extension-highlight";
import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";
import { io } from "socket.io-client";
import useAuthstore from "@/store/authstore";
import useBlogmstore from "@/store/Blogm";
import { debounce } from "lodash";
import api from "@/axios";
import { generateJSON } from "@tiptap/html";
import { SocketIOProvider } from "y-socket.io";
import { HocuspocusProvider } from "@hocuspocus/provider";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";


const yjsInstances = new Map();



export default function Collabe({ intialContent = "", onContentChange, blogid }) {
  const { user } = useAuthstore()
  const { setblogtext, blogt } = useBlogmstore()
  const [initialContentApplied, setInitialContentApplied] = useState(false);
  const instanceKey = `blog-${blogid}`;
  let ydoc, provider;
  if (!yjsInstances.has(instanceKey)) {
    ydoc = new Y.Doc();
    provider = new WebsocketProvider(
      'ws://localhost:5001',
      instanceKey,
      ydoc
    );
    yjsInstances.set(instanceKey, { ydoc, provider });
  } else {
    ({ ydoc, provider } = yjsInstances.get(instanceKey));
  }

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: ydoc, field: 'content' }),
      CollaborationCaret.configure({
        provider,
        user: { name: user.name || 'Anonymous', color: getRandomColor() }
      })

    ],
    editable: true,
  }, [blogid, user.name]);





  useEffect(() => {
    if (!editor || !ydoc || initialContentApplied) return;

    // Wait a bit to let WebSocket sync happen
    const timer = setTimeout(() => {
      const contentFragment = ydoc.getXmlFragment('content');
      const isReallyEmpty = contentFragment.toString() === '';

      if (isReallyEmpty && intialContent) {
        editor.commands.setContent(intialContent);
        setInitialContentApplied(true); // ✅ Prevent re-applying
      } else {
        // Content already exists (from peers or sync) → mark as applied
        setInitialContentApplied(true);
      }
    }, 300); // Wait 300ms for WebSocket to sync

    return () => clearTimeout(timer);
  }, [editor, ydoc, intialContent, initialContentApplied]);

  // Auto-save Yjs state every 30 seconds
  useEffect(() => {
    if (!ydoc || !blogid || !user?.token) return;

    const saveToBackend = async () => {
      try {
        // Encode the full Yjs document state
        const update = Y.encodeStateAsUpdate(ydoc);
        const base64Update = btoa(
          String.fromCharCode(...new Uint8Array(update))
        );

        const prosemirrorJson = editor.getJSON();
        await api.post(
          `/blogs/saveyjs/${blogid}`,
          { yjsUpdate: base64Update, prosemirrorJson: prosemirrorJson },
          {
            headers: { Authorization: `Bearer ${user.token}` }
          }
        );
        console.log('✅ Auto-saved collaborative state');
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    };

    // Save every 10 seconds
    const interval = setInterval(saveToBackend, 10_000);

    // Also save on window close


    return () => {
      clearInterval(interval);

    };
  }, [ydoc, blogid, user?.token]);


  function Toolbar1() {
    if (!editor) return null;
    return (
      <div className="flex gap-3 justify-between p-4 items-center">
        <button type="button" onClick={() => {
          editor.chain().focus().toggleBold().run()
        }} className="tooltip tooltip-right " data-tip="Bold"  >
          <BoldIcon className={editor.isActive("bold") ? "text-blue-500" : ""} />
        </button>

        <button type="button" onClick={() => {
          editor.chain().focus().toggleItalic().run()

        }} className="tooltip tooltip-right" data-tip="Italic"  >
          <ItalicIcon className={editor.isActive("italic") ? "text-blue-500" : ""} />
        </button>

        <button type="button" onClick={() => {
          editor.chain().focus().toggleStrike().run()

        }} className="tooltip tooltip-right" data-tip="Strike" >
          < StrikeIcon className={editor.isActive("strike") ? "text-blue-500" : ""} />
        </button>


        <button type="button" onClick={() => {
          editor.chain().focus().toggleCode().run()

        }} className="tooltip tooltip-right" data-tip="Code"  >
          < Code2Icon className={editor.isActive("code") ? "text-blue-500" : ""} />
        </button>

        <button type="button" onClick={() => {
          editor.chain().focus().toggleUnderline().run()

        }} className="tooltip tooltip-right" data-tip="Underline"  >
          < UnderlineIcon className={editor.isActive("underline") ? "text-blue-500" : ""} />
        </button>

        <div className="tooltip tooltip-right" data-tip="Heading">
          <select name="" id="" onChange={(e) => {
            const level = Number(e.target.value)
            if (level === 0) {
              editor.chain().focus().setParagraph().run()
            } else {
              editor.chain().focus().toggleHeading({ level: level }).run()
            }

          }} value={
            editor.isActive("heading", {
              level: 1
            }) ? "1" : editor.isActive("heading", {
              level: 2
            }) ? "2" : editor.isActive("heading", {
              level: 3
            }) ? "3" : editor.isActive("heading", {
              level: 4
            }) ? "4" : editor.isActive("heading", {
              level: 5
            }) ? "5" : editor.isActive("heading", {
              level: 6
            }) ? "6" : "0"
          } className="select"  >
            <option value="0">Normal</option>
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="3">H3</option>
            <option value="4">H4</option>
            <option value="5">H5</option>
            <option value="6">H6</option>
          </select>
        </div>




        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="tooltip tooltip-right " data-tip="Bullet List" >
          <HiListBullet className={editor.isActive("bulletList") ? "text-blue-500" : ""} />
        </button>

        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className="tooltip tooltip-right " data-tip="Ordered List">
          < RiListOrdered2 className={editor.isActive("orderedList") ? "text-blue-500" : ""} />
        </button>

        <button type="button" onClick={() => editor.chain().focus().setHardBreak().run()} className="tooltip tooltip-right " data-tip="Line Break">
          <FaGripLines />
        </button>

        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="tooltip tooltip-right " data-tip="Undo">
          <Undo2Icon />
        </button>

        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="tooltip tooltip-right " data-tip="Redo">
          <Redo2Icon />
        </button>


        <div className="tooltip tooltip-right" data-tip="Font Family">
          <select name="" id="" onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            value={editor.getAttributes("textStyle").fontFamily || "Arial"}
            className="select"  >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="monospace">Monospace</option>
            <option value="Serif">Serif</option>
            <option value="cursive">Cursive</option>
            <option value="Georiga">Georiga</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Verdana">Verdana</option>
            <option value="Impact">Impact</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Courier New">Courier New</option>
            <option value="Lucida Console">Lucida Console</option>
            <option value="Garamond">Garamond</option>
            <option value="Palatino Linotype">Palatino Linotype</option>
            <option value="Brush Script MT">Brush Script MT</option>
          </select>
        </div>

        <div className="tooltip tooltip-right" data-tip="Font Size">
          <select name="" id="" onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
            value={editor.getAttributes("textStyle").fontSize || "16px"}
            className="select" >
            <option value="12px">12px</option>
            <option value="16px">16px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
            <option value="28px">28px</option>
            <option value="32px">32px</option>
          </select>
        </div>







        <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className="tooltip tooltip-right " data-tip="Align Left">
          <AlignLeftIcon className={editor.isActive({ textAlign: "left" }) ? "text-blue-500" : ""} />
        </button>

        <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className="tooltip tooltip-right " data-tip="Align Center">
          <AlignCenterIcon className={editor.isActive({ textAlign: "center" }) ? "text-blue-500" : ""} />
        </button>

        <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className="tooltip tooltip-right " data-tip="Align Right">
          <AlignRightIcon className={editor.isActive({ textAlign: "right" }) ? "text-blue-500" : ""} />
        </button>


        <div className="tooltip tooltip-right" data-tip="Highlight">
          <select onChange={(e) => {
            const color = e.target.value;
            if (color === "none") {
              editor.chain().focus().unsetHighlight().run()
            } else {
              editor.chain().focus().toggleHighlight({ color }).run()
            }
          }} value={editor.getAttributes("highlight").color || "none"} className="select ">
            <option value="none">No Highlight</option>
            <option value="#fff23f">Yellow</option>
            <option value="#ffb7b7">Red</option>
            <option value="#a0e7a0">Green</option>
            <option value="#95e7ff">Blue</option>
            <option value="fa6ff7">Pink</option>
          </select>
        </div>



      </div>
    )
  }

  return (


    <div className=" border rounded-xl w-full overflow-y-auto " style={{ scrollbarWidth: "none" }} >
      <div className="border-b w-full overflow-x-auto " style={{ scrollbarWidth: "none" }}>
        <Toolbar1 />
      </div>

      <EditorContent editor={editor} className="p-4 h-[60vh]  w-full max-w-full  overflow-y-auto" style={{ scrollbarWidth: "none" }} />

    </div>


  )
}