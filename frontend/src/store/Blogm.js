import { create } from "zustand";
import api from "../axios";
import useAuthstore from "./authstore";

const ls = localStorage.getItem("user");
const localuser = JSON.parse(ls);

const useBlogmstore = create((set,get) => ({
  users: [],
  fetchusers: async () => {
          const {user} = useAuthstore.getState()
    if(!user) return;
    const res = await api.get("/blogs/get-users", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    set({ users: res.data });
  },
  ubox:false,
  setubox: () => {
    set((state) => {
        return{
           ubox: state.ubox === true ? false : true
        }
    })
  },
  selectusers: [],
  setselectusers: (value) => {
   set((state) => {
     const exists = state.selectusers.includes(value)

     return {
        selectusers: exists ? state.selectusers.filter((s) => s !== value) : [...state.selectusers,value]
     }
   })
   
  },
  blog:"",
  setroomid: (b) => {
    set({blog: b})
  },
  blogt: "",
  setblogtext: (text) => {
    set({blogt: text})
  },
  clearblogtext: () => {
    set({blogt: ""})
  },
  


}));

export default useBlogmstore;