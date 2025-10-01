import Insertdate from "@/services/inserdate"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Blockquote from '@tiptap/extension-blockquote'
import Text from "@tiptap/extension-text";
import "../styles/styles.scss"
import { Details, DetailsContent, DetailsSummary } from '@tiptap/extension-details'
import { Dropcursor, Placeholder } from '@tiptap/extensions'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { useCallback } from "react";
import Image from "@tiptap/extension-image"

export default function Customeextension() {

    const editor = useEditor({
        extensions: [
            StarterKit,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),

            Details.configure({
                persist: true,
                HTMLAttributes: {
                    class: 'details',
                },
            }),
            DetailsSummary,
            DetailsContent,
            Placeholder.configure({
                includeChildren: true,
                placeholder: ({ node }) => {
                    if (node.type.name === 'detailsSummary') {
                        return 'Summary'
                    }

                    return null
                },
            }),
            Image,
            Dropcursor



        ],

    })

    const addImage = useCallback(() => {
        const url = window.prompt('URL')

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    return (

        <div >
            <h1>custom extension</h1>
            <div>
                <button className="btn" onClick={() => editor.chain().focus().toggleBlockquote().run()}>blackquote</button>
                <button className="btn" onClick={() => editor.chain().focus().toggleBulletList().run()}>bullet list</button>
                <button className="btn" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code block</button>
                <button className="btn" onClick={() => editor.chain().focus().toggleStrike().run()}>strike</button>
                <button className="btn" onClick={() => editor.chain().focus().setDetails().run()} disabled={!editor.can().setDetails()}>
                    Set details
                </button>
                <button className="btn" onClick={() => editor.chain().focus().unsetDetails().run()} disabled={!editor.can().unsetDetails()}>
                    Unset details
                </button>
                <button className="btn" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>h1</button>
                <button className="btn" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>h2</button>
                <button className="btn" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>h3</button>
                <button className="btn" onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
                <button className="btn" onClick={() => editor.chain().focus().toggleUnderline().run()}>underline</button>
                <button className="btn" onClick={() => editor.chain().focus().toggleCode().run()}>code</button>
                <button className="btn" onClick={() => editor.commands.setParagraph()}>p</button>
                <button className="btn" onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet list</button>
                <button className="btn" onClick={() => editor.commands.toggleTaskList()}>task list</button>
                <button className="btn" onClick={() => editor.chain().focus().toggleLink({ href: "https://www.google.com" }).run()}>link</button>
                <button onClick={addImage}>Add img</button>
                <button className="btn" onClick={() => editor.commands.setImage({ src: "https://tse1.mm.bing.net/th/id/OIP.Egx6GsHbuNS-5j9JvmOifwHaFj?w=800&h=600&rs=1&pid=ImgDetMain&o=7&rm=3" })}>add img</button>
                <button className="btn" onClick={() => editor.chain().focus().setHorizontalRule().run()}>add hr</button>
                <button className="btn" onClick={() => editor.chain().focus().undo().run()}>undo</button>
                <button className="btn" onClick={() => editor.chain().focus().redo().run()}>redo</button>


            </div>

            <div className="p-10 border-none outline-none">
                <EditorContent editor={editor} className="focus:outline-none focus:border-none border-transparent" />
            </div>




        </div>
    )
}