import { useState } from "react"
import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    BarChart,
    Bar,
    ResponsiveContainer

} from "recharts";
import { couch } from "globals";

export default function Writeranalytics({ data, popularblogs, postanalytics }) {






    const totalwords = data?.reduce((a, b) => {
        const words = b?.blogtext?.trim()?.split(/\s+/)?.length;

        return a + words;
    }, 0)

    const totallikes = data?.reduce((a, b) => {
        const perlike = b?.likes?.length;
        return a + perlike;
    }, 0)

    const totalcomments = data?.reduce((a, b) => {
        const percomment = b?.comments?.length;
        return a + percomment;
    }, 0)

    const totalviews = data?.reduce((a, b) => {
        const pervieww = b?.views?.length;
        return a + pervieww;
    }, 0)

    const stats = {
        totalBlogs: data?.length,
        totalWords: totalwords,
        totalLikes: totallikes,
        totalComments: totalcomments,
        totalViews: totalviews,
    };

    const viewstrends = postanalytics?.map((b) => ({
        day: new Date(b?.entryat).toLocaleDateString("en-US", {
            weekday: "short"
        }),
        views: b?.postid?.views?.length || 0,
    })).slice(0, 10)

    const devicedata = postanalytics?.map((b) => ({
        name: b?.device,
        value: b?.device === "desktop" ? 3000 : 2000,

    })).slice(0, 10).slice(0, 10)

    const pb = postanalytics?.map((b) => ({
        title: b?.postid?.blogtext?.slice(0, 30) + "...",
        views: b?.postid?.views?.length,
        likes: b?.postid?.likes?.length || 0,
        avgduration: b?.duration || 0,
    })).sort((a, b) => b?.postid?.views?.length - a?.postid?.views?.length).slice(0, 5)

  


    const locationData = [
        { name: "Kolkata", value: 1200 },
        { name: "Balurght", value: 800 },
        { name: "BARRACKPORE", value: 500 },
    ];


    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

    const avgdurations = {};

    postanalytics.forEach((session) => {
        const blogid = session.postid._id;
        if(!avgdurations[blogid]){
            avgdurations[blogid] = {
                totalduraion: 0,count:0, title: session?.postid?.blogtext?.slice(0,30),views:session?.postid?.views?.length,likes:session?.postid?.likes?.length
            }
        }

        avgdurations[blogid].totalduraion += session.duration || 0;
        avgdurations[blogid].count++;
    });

    const avgdurationdata = Object.keys(avgdurations).map((blogid) => ({
        blogid,
        title: avgdurations[blogid].title,
        avgduration: avgdurations[blogid].totalduraion / avgdurations[blogid].count,
        views: avgdurations[blogid].views,
        likes: avgdurations[blogid].likes,
    }))


    return (
        <div className="p-6 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {
                    [
                        {
                            label: "Total Blogs", value: stats.totalBlogs

                        },
                        { label: "Total Words", value: stats.totalWords },
                        { label: "Total Likes", value: stats.totalLikes },
                        { label: "Total Comments", value: stats.totalComments },
                        { label: "Total Views", value: stats.totalViews },
                    ].map((item, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="card bg-base-200 shadow-xl" >
                            <div className="card-body text-center">
                                <h2 className=" text-lg font-bold">{item.label}</h2>
                                <p className="text-2xl font-extrabold">{item.value}</p>
                            </div>
                        </motion.div>
                    ))
                }
            </div>


            <div className="card bg-base-200 shadow-xl h-[40vh] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                <div className="card-body">
                    <h2 className="card-title">Popular Blogs</h2>
                    <div className="">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Views</th>
                                    <th>Likes</th>
                                    <th>Avg Duration (sec)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    avgdurationdata?.map((blog, idx) => (
                                        <motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={idx}>
                                            <td>{blog.title}</td>
                                            <td>{blog.views}</td>
                                            <td>{blog.likes}</td>
                                            <td>{blog.avgduration}</td>
                                        </motion.tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card bg-base-300 shadow-xl p-4 ">
                    <h2 className="text-lg font-bold mb-4">Device Breakdown</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={devicedata} dataKey="value" name="name" cx="50%" cy="50%" outerRadius={100} label>
                                {
                                    devicedata?.map((entry, idx) => (
                                        <Cell key={`Cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                    ))
                                }
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card bg-base-200 shadow-xl p-4"
                >
                    <h2 className="text-lg font-bold mb-4">🌍 Reader Locations</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={locationData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {locationData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card bg-base-200 shadow-xl p-4">
                <h2 className="text-lg font-bold mb-4">📊 Views Trend (Weekly)</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={viewstrends} >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="views" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card bg-base-200 shadow-xl p-4"
            >
                <h2 className="text-lg font-bold mb-4">⏱ Avg Reading Duration</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={avgdurationdata}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="title" />
                        <YAxis  />
                        <Tooltip />
                        <Bar dataKey="avgduration" fill="#00C49F" />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>




        </div>
    )
}