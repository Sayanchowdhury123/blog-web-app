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

  const viewstrends = postanalytics?.map((b) => ({
      day: new Date(b?.entryat).toLocaleDateString("en-US",{
        weekday: "short"
      }),
      views: b?.postid?.views?.length || 0,
  }))

  const devicedata = postanalytics?.map((b) => ({
      name: b?.device,
    
  }))

  const pb = postanalytics?.map((b) => ({
    title: b?.postid?.blogtext?.slice(0,30) + "...",
    views: b?.postid?.views?.length,
    likes: b?.postid?.likes?.length || 0,
    avgduration: b?.duration || 0,
  })).sort((a,b) => b?.postid?.views?.length - a?.postid?.views?.length)

 

 

  const COLORS = ["#0088FE","#00C49F","#FFBB28","#FF8042"]

    return (
        <div>
            <h1>Analytics</h1>
            <div>
                <p>Total Written Blogs: <span>{data?.length}</span></p>
                <p>Total Words Written: <span>{totalwords}</span></p>
                <p>Total Views: <span>{totalviews}</span></p>
            </div>

            <div>
                <p>Total Likes: <span>{totallikes}</span></p>
                <p>Total Comments: <span>{totalcomments}</span></p>
            </div>

            <div>
                <p>Top Performing Blogs</p>
                <div>
                    {
                        popularblogs?.map((p) => (
                            <div key={p._id}>
                                <p>{p.title}</p>
                                <img src={p?.coverimage} alt="coverimage" className="w-[300px]  object-cover" />
                            </div>
                        ))
                    }
                </div>
            </div>

        </div>
    )
}