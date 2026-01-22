import useHomestore from "@/store/homestore"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion";
import { IoReload } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { RiEdit2Fill } from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";
import toast from "react-hot-toast";
import useAuthstore from "@/store/authstore";
import api from "@/axios";
import { useLocation } from "react-router-dom";
import { socket } from "@/services/Socketp";


export default function Comments({ blogId, blogtitle, owner }) {
    const { commentsByBlog, fetchComments, addComment, delcom, editcom, cid } = useHomestore();
    const blogState = commentsByBlog[blogId] || { comments: [], hasMore: true };
    const [newComment, setNewComment] = useState('');
    const [option, setoption] = useState(null)
    const inputref = useRef(null)
    const [edit, setedit] = useState(false)
    const [editid, seteditid] = useState(null)
    const { user } = useAuthstore();
    const location = useLocation()

    useEffect(() => {
        if (blogState.comments.length === 0) {
            fetchComments(blogId);
        }
    }, [blogId]);


    const blogcommentnotification = async (username, owner, blogId, blogtitle) => {

        try {
            if (blogId && username && owner) {
                const res = await api.post(`/notify/commented`, { username, owner, blogid: blogId, blogtitle }, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })

                socket.emit("sendNotification", {
                    user: owner,
                    message: `💬 ${username} commented on your blog ${blogtitle}`,
                    link: `/search?blogId=${blogId}&openComment=${"true"}`,
                    read: false,
                    type: "newcomment",
                    senderid: user?.id,
                })
            }

        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong");
        }
    }

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        await addComment(blogId, newComment);
        blogcommentnotification(user?.name, owner, blogId, blogtitle)

        setNewComment('');

    };



    const handledelcomment = async (commentid) => {
        try {
            await delcom(blogId, commentid)
            toast('Comment Deleted',
                {
                    icon: '🎉',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                })
        } catch (error) {
            toast('Comment Deletion failed',
                {
                    icon: '❌',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                })

        }
    }

    const handleeditcomment = async () => {
        try {
            if (editid) {

                await editcom(blogId, editid, newComment)

                toast('Comment Edited',
                    {
                        icon: '🎉',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    })

                setNewComment('');
            }

        } catch (error) {
            toast('Comment Updation failed',
                {
                    icon: '❌',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                })

        } finally {
            setedit(false)
        }
    }

    const del = (cid) => {
        inputref.current.focus()
        setedit(true)
        seteditid(cid)

    }








    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} exit={{ opacity: 0 }} className="">

            <div className="flex gap-2 mb-3 px-4 ">
                <input
                    type="text"
                    className="flex-1 border rounded-full px-2 py-1"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={edit ? "Edit your comment" : "Write your comment "}
                    ref={inputref}
                />
                {
                    edit ? (
                        <button
                            onClick={handleeditcomment}
                            className="bg-blue-500 text-white px-3 py-1 rounded-full"
                        >
                            Edit
                        </button>
                    ) : (
                        <button
                            onClick={handleAddComment}
                            className="bg-blue-500 text-white px-3 py-1 rounded-full"
                        >
                            Post
                        </button>
                    )
                }

            </div>


            <div>
                {blogState?.comments?.map((c, i) => (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} key={c._id} className="p-4 flex justify-between items-center" id={c._id}>
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
                                {
                                    c?.user?._id === user?.id && (
                                        <>
                                            <BsThreeDots />

                                            {
                                                option === c._id && (
                                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="w-[100px] h-[60px] rounded-tl-xl rounded-bl-xl rounded-br-xl flex flex-col justify-center px-3 bg-base-200 absolute right-[-5px] top-5" >

                                                        <div className="text-sm flex items-center gap-2" onClick={() => del(c._id)}>
                                                            <RiEdit2Fill />Edit
                                                        </div>
                                                        <div className="text-sm flex items-center gap-2 cursor-pointer" onClick={() => handledelcomment(c._id)}><AiFillDelete />Delete</div>
                                                    </motion.div>
                                                )
                                            }
                                        </>
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