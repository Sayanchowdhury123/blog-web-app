
import { Extension } from "@tiptap/react";

const Insertdate = Extension.create({
    name: "insertdate",
    addCommands(){
        return {
            insertdate: () => ({commands}) => {
                const today = new Date().toLocaleDateString()
                return commands.insertContent(today)
            },
        }
    }
})

export default Insertdate;