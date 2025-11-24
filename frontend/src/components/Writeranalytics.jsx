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
import dayjs from "dayjs";
import useAuthstore from "@/store/authstore";

export default function Writeranalytics({ data, popularblogs, postanalytics, editordata, editinfo }) {
    const { user } = useAuthstore()

    const viewstrenddata = [].slice(0, 7)

    postanalytics.reduce((acc, record) => {
        const date = dayjs(record.entryat).format("YYYY-MM-DD");
        const existing = viewstrenddata.find((d) => d.date === date)

        if (existing) {
            return
        } else {
            viewstrenddata.push({
                date, views: record?.postid?.views?.length,
            })
        }

        return acc;
    }, [])



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

    const devicecount = {};

    postanalytics.forEach((record) => {
        const device = record.device;
        if (devicecount[device]) {
            devicecount[device] += 1
        } else {
            devicecount[device] = 1;
        }
    })

    const dt = Object.keys(devicecount).map((key) => ({
        name: key,
        value: devicecount[key],
    }))



    const locationData = [
        { name: "Kolkata", value: 1200 },
        { name: "Mumbai", value: 800 },
        { name: "Delhi", value: 500 },
    ];

    const approvedata = [
        {
            name: "Approved", value: parseFloat(editordata?.approvalRate)
        },
        {
            name: "Disapproved", value: parseFloat(editordata?.disapprovalrate)
        },
    ]


    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

    const avgdurations = {};

    postanalytics.forEach((session) => {
        const blogid = session.postid._id;
        if (!avgdurations[blogid]) {
            avgdurations[blogid] = {
                totalduraion: 0, count: 0, title: session?.postid?.title, views: session?.postid?.views?.length, likes: session?.postid?.likes?.length
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


    const totaltimeedited = editinfo[0]?.blogsEdited?.reduce((a, b) => {
        const edittime = b?.duration;
        return a + edittime;
    }, 0)




    return (
        <div className="p-6 space-y-8">

            <h1 className="text-4xl font-bold text-center">Analysis</h1>

            {
                user?.role === "editor" && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {
                            [
                                {
                                    label: "Total Reviewd", value: editordata.totalReviewed

                                },
                                { label: "Approval Rate", value: `${editordata.approvalRate}%` },
                                { label: "Total Approved", value: editordata.approved },
                                { label: "Total Disapproved", value: editordata.disapproved },
                                { label: "Total Edited", value: editinfo[0]?.blogsEdited?.length },


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
                )
            }



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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">

                {
                    user?.role === "editor" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="card bg-base-200 shadow-xl p-4"
                        >
                            <h2 className="text-lg font-bold mb-4">Approved VS Rejected</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={approvedata}
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
                    )
                }

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card bg-base-300 shadow-xl p-4 ">
                    <h2 className="text-lg font-bold mb-4">📱 Device Breakdown</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={dt} dataKey="value" name="name" cx="50%" cy="50%" outerRadius={100} label>
                                {
                                    dt?.map((entry, idx) => (
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


            {
                user?.role === "editor" && (
                    <div className="card bg-base-200 shadow-xl  h-[40vh] overflow-y-auto  sm:w-full w-[384px]" style={{ scrollbarWidth: "none" }}>
                        <div className="card-body">
                            <h2 className="card-title">📈 Editing Time</h2>
                            <div className="">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Views</th>
                                            <th>Likes</th>
                                            <th>Edit Time (sec)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            editinfo[0]?.blogsEdited?.map((blog, idx) => (
                                                <motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={idx}>
                                                    <td>{blog.blogid.title}</td>
                                                    <td>{blog.blogid.views?.length}</td>
                                                    <td>{blog.blogid.likes?.length}</td>
                                                    <td>{blog.duration}</td>
                                                </motion.tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )
            }

            <div className="card bg-base-200 shadow-xl h-[40vh] overflow-y-auto  sm:w-full w-[384px]" style={{ scrollbarWidth: "none" }}>
                <div className="card-body">
                    <h2 className="card-title">📈 Popular Blogs</h2>
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



            <motion.div initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card bg-base-200 shadow-xl p-4">
                <h2 className="text-lg font-bold mb-4">📊 Views Trend (Daily)</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={viewstrenddata} >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
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
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="avgduration" fill="#00C49F" />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>




        </div>
    )
}