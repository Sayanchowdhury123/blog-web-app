import { useState } from "react"


export default function Writeranalytics({data,popularblogs}){
 
   
console.log(popularblogs);

    

const totalwords = data?.reduce((a,b) => {
     const words = b?.blogtext?.trim()?.split(/\s+/)?.length;
    
      return a + words;
},0)

const totallikes = data?.reduce((a,b) => {
    const perlike = b?.likes?.length;
    return a + perlike;
},0)

const totalcomments = data?.reduce((a,b) => {
    const percomment = b?.comments?.length;
    return a + percomment;
},0)



    return (
        <div>
          <h1>Analytics</h1>
          <div>
            <p>Total Written Blogs: <span>{data?.length}</span></p>
            <p>Total Words Written: <span>{totalwords}</span></p>
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