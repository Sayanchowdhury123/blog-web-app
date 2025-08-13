import useHomestore from "@/store/homestore"
import { useEffect, useState } from "react"
import { motion } from "framer-motion";
import { IoReload } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { RiEdit2Fill } from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";


export default function Comments({ blogId }) {
    const { commentsByBlog, fetchComments, addComment } = useHomestore();
    const blogState = commentsByBlog[blogId] || { comments: [], hasMore: true };
    const [newComment, setNewComment] = useState('');
       const[option,setoption] = useState(null)

    useEffect(() => {
        if (blogState.comments.length === 0) {
            fetchComments(blogId);
        }
    }, [blogId]);

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        addComment(blogId, newComment);
        setNewComment('');
    };


    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} exit={{opacity:0}} className="">

            <div className="flex gap-2 mb-3 px-4 ">
                <input
                    type="text"
                    className="flex-1 border rounded-full px-2 py-1"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                />
                <button
                    onClick={handleAddComment}
                    className="bg-blue-500 text-white px-3 py-1 rounded-full"
                >
                    Post
                </button>
            </div>


            <div>
                {blogState.comments.map((c, i) => (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} key={c._id} className="p-4 flex justify-between items-center">
                        <div>
                          <div className="flex gap-2 items-center">
                            <img src={c?.user?.profilepic} alt="profile" className="w-8 h-8 rounded-full mt-1" />
                            <div>
                                <p className="font-semibold">{c?.user?.name}</p>
                                <p className="text-[10px]">Posted on: {new Date(c?.createdAt).toLocaleDateString()}</p>

                            </div>
                        </div>

                        <p className="ml-10">{c?.text}</p>
                        </div>

                
                   <div className="mb-7 " type="button" onClick={() => setoption(option === c._id ? null : c._id)}>
                         <div className="relative">
                           <BsThreeDots/>

                            {
                            option === c._id && (
                                <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{duration:0.2}} className="w-[100px] h-[60px] rounded-tl-xl rounded-bl-xl rounded-br-xl flex flex-col justify-center px-3 bg-base-200 absolute right-[-5px] top-5" >

                                 <div className="text-sm flex items-center gap-2">
                                    <RiEdit2Fill/>Edit
                                    </div>
                                 <div className="text-sm flex items-center gap-2"><AiFillDelete/>Delete</div>
                                </motion.div>
                            )
                        }
                           
                         </div>

                         
                            
                        </div>

                       
                  
                        

                        

                      
                       


                    </motion.div>
                ))}
            </div>

            <div className="  pb-4 text-center">
                {blogState.hasMore && (
                    <div>
                        
                        <button
                            onClick={() => fetchComments(blogId)}
                            className="font-semibold text-gray-400 "
                        >
                            Load more comments
                        </button>
                    </div>

                )}
            </div>

        </motion.div>
    );
}