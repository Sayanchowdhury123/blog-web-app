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
  comments:[],
  addcomment: async (id,text) => {
    console.log(id,text);
     const res = await api.patch(`/home/${id}/add-comment/${localuser.id}`,{text:text},{
       headers: {
        Authorization: `Bearer ${localuser.token}`,
      },
    })

 

    set((state) => {
      return {
        comments: [res.data,...state.comments]
      }
    })
  },
  skip:0,
  limit:3,
  hasmore: true,
  rendercomment: async (id) => {
    const {skip,limit} = get()
 
    const res = await api.get(`/home/${id}/comments?skip=${skip}&limit=${limit}`,{
       headers: {
        Authorization: `Bearer ${localuser.token}`,
      },
    })
   
    set((state) => ({
      comments: [...state.comments,...res.data.comments],
    skip: state.skip + state.limit,
    hasmore: res.data.hasmore
    }))
  }

 

}));

export default useHomestore;