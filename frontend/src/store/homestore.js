import { create } from "zustand";
import api from "../axios";
import useAuthstore from "./authstore";

const ls = localStorage.getItem("user");
const localuser = JSON.parse(ls);


const useHomestore = create((set,get) => ({
  blogs: [],
  fetchinfo: async () => {
    const res = await api.get(`/home/allblogs`);

    set({ blogs: res.data });
  },
  comid: "",
  setcomid: (id) => {
     set({comid: id})
  },

  togglelike: async (id) => {

    const res = await api.patch(`/home/${id}/likes/${localuser.id}`,{},{
       headers: {
        Authorization: `Bearer ${localuser.token}`,
      },
    })
     
      set((state) => {
     return {blogs: state.blogs.map((b) => b._id === id ? {...b, likes:[...b.likes,localuser.id]} : b)} 
    });
 
  },
   removelike: async (id) => {
  
    const res = await api.patch(`/home/${id}/rlikes/${localuser.id}`,{},{
       headers: {
        Authorization: `Bearer ${localuser.token}`,
      },
    })
  
     set((state) => {
     return {blogs: state.blogs.map((b) => b._id === id ? {...b, likes: b.likes.filter((id) => id !== localuser.id )} : b)} 
    });
 
  },

 
 

  commentsByBlog: {},
    fetchComments: async (blogId) => {
    const blogState = get().commentsByBlog[blogId] || {
      comments: [],
      skip: 0,
      limit: 3,
      hasMore: true
    };

    if (!blogState.hasMore) return;

    const res = await api.get(`/home/${blogId}/comments?skip=${blogState.skip}&limit=${blogState.limit}`, {
      headers: { Authorization: `Bearer ${localuser.token}` }
    });

    set((state) => ({
      commentsByBlog: {
        ...state.commentsByBlog,
        [blogId]: {
          comments: [...blogState.comments, ...res.data.comments],
          skip: blogState.skip + blogState.limit,
          limit: blogState.limit,
          hasMore: res.data.hasmore
        }
      }
    }));
  },

  addComment: async (blogId, text) => {
    const res = await api.patch(`/home/${blogId}/add-comment/${localuser.id}`, { text }, {
      headers: { Authorization: `Bearer ${localuser.token}` }
    });

    set((state) => {
      const blogState = state.commentsByBlog[blogId] || {
        comments: [],
        skip: 0,
        limit: 3,
        hasMore: true
      };

      return {
        commentsByBlog: {
          ...state.commentsByBlog,
          [blogId]: {
            ...blogState,
            comments: [res.data, ...blogState.comments] 
          }
        }
      };
    });
  }

}));



 


export default useHomestore;