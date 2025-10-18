import useAuthstore from "@/store/authstore"
import useNotificationstore from "@/store/notificationstore"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { BsBell } from "react-icons/bs"
import { Link } from "react-router-dom"


export default function Notificaion() {
    const { notifications, unreadCount, fetchnotifications, markasread } = useNotificationstore()
    const [open, setopen] = useState(false)
    const { user } = useAuthstore()

    useEffect(() => {
        if (user) fetchnotifications()
    }, [user, fetchnotifications])


    return (
        <div className="relative">
            <button className="btn btn-ghost btn-circle" onClick={(e) => {
                e.stopPropagation()
                setopen(!open)
            }}>
                <div className="indicator">
                    <BsBell className="w-5 h-5" />
                    {
                        unreadCount > 0 && (
                            <span className="badge badge-error badge-xs indicator-item">
                                {unreadCount}
                            </span>
                        )
                    }
                </div>
            </button>


            <AnimatePresence>
                {
                    open && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-4 w-80 bg-base-200 shadow-xl rounded-xl overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-3 border-b border-base-300">
                                <h3 className="font-semibold">Notifications</h3>
                                <button
                                    className="text-sm text-primary hover:underline"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        markasread()
                                    }}
                                >
                                    Mark as read
                                </button>
                            </div>


                            <div className="max-h-80 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                                {
                                    notifications?.filter((n) => !n.read).length === 0 ? (
                                        <p className="p-4 text-sm text-center text-gray-400">
                                            No new notifications
                                        </p>
                                    ) : (
                                        notifications?.filter((n) => !n.read).map((n) => (
                                            <Link to={n.link || "#"} key={n._id} onClick={(e) => {
                                                e.stopPropagation()
                                                setopen(false)
                                            }}>
                                                <motion.div  className={`p-3 border-b hover:bg-[#f3f4f6] border-base-300 ${!n.read ? "bg-base-100" : ""}`}>
                                                    <p className="text-sm">{n.message}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(n.createdAt).toLocaleString()}
                                                    </p>


                                                </motion.div>
                                            </Link>
                                        ))
                                    )
                                }
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>
    )
}