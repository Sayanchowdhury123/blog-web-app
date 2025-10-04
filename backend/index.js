const app = require("./app")
const connectdb = require("./config/db")
const http = require("http")
const { YSocketIO } = require("y-socket.io/dist/server");
const {Server} = require("@hocuspocus/server")
const expressWs = require("express-ws");
expressWs(app)
connectdb()

const jwt = require("jsonwebtoken")
const rooms = {};
const Y = require("yjs")
const Blogs = require("./models/Blogs")

const documentCache = new Map();

const hocuspocus = new Server({
    async onLoadDocument({ documentName }) {
        const blogId = documentName.split('?')[0]; // Clean the blogId from the query string
        
        // 1. Try to get the document from the cache
        let ydoc = documentCache.get(blogId);

        if (!ydoc) {
            // 2. If not cached, load from the database
            const blog = await Blogs.findById(blogId);

            if (!blog) {
                console.warn(`[LOAD] Blog not found: ${blogId}. Starting fresh Y.Doc.`);
                ydoc = new Y.Doc();
            } else if (blog.yjsState) {
                console.log(`[LOAD] Blog ${blogId} loaded from database.`);
                ydoc = new Y.Doc();
                // Apply the saved state (Uint8Array)
                Y.applyUpdate(ydoc, blog.yjsState);
            } else {
                console.log(`[LOAD] Blog ${blogId} found, but no Yjs state. Starting fresh.`);
                ydoc = new Y.Doc();
            }

            documentCache.set(blogId, ydoc);
        }
        
        return ydoc;
    },

    /**
     * Document Store Hook: Saves the document state back to the database.
     */
    async onStoreDocument({ documentName, document }) {
        const blogId = documentName.split('?')[0]; // Clean the blogId
        
        // Convert the Y.Doc state to a storable Uint8Array
        const yjsState = Y.encodeStateAsUpdate(document);

        // Update the database entry
        await Blogs.findByIdAndUpdate(blogId, {
            yjsState: Buffer.from(yjsState) // Store as a buffer/binary type
        });
        
        console.log(`[SAVE] Blog ${blogId} state saved.`);
    },

    /**
     * Disconnect Hook: Clean up cache when document is empty (optional but good).
     */
    async onDestroy(data) {
        const blogId = data.documentName.split('?')[0];
        // If the document is truly empty and no one is using it, you can clear the cache
        // if (data.clientsCount === 0) {
        //     documentCache.delete(blogId);
        //     console.log(`[CLEAN] Blog ${blogId} removed from cache.`);
        // }
    },
 async onConnect (data) {
    console.log("new websocket connection",data.socketId);
  }
})

app.ws("/collaboration",(ws,req) => {

    hocuspocus.handleConnection(ws,req)
})


const PORT = process.env.PORT ;




app.listen(PORT, () => {
  console.log(`server running ${PORT}`);
});