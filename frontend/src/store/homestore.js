import { create } from "zustand";
import api from "../axios";
import useAuthstore from "./authstore";

const ls = localStorage.getItem("user");
const localuser = JSON.parse(ls);


const useHomestore = create((set) => ({
  blogs: [],
  fetchinfo: async () => {
    const res = await api.get(`/home/allblogs`);

    set({ blogs: res.data });
  },
  showedit: false,
  setshowedit: () => {
     set((state) => {
      return { showedit: !state.showedit};
    })
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
 
  }

 

}));

export default useHomestore;