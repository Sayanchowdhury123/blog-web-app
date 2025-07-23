import { create } from "zustand";
import api from "../axios";

const ls = localStorage.getItem("user")
const localuser = JSON.parse(ls)


const useAuthstore = create((set) => ({
  user: localuser || null,
  
  login: (user) => {
  
    localStorage.setItem("user",JSON.stringify(user));
    
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("user");

    set({ user: null });
  },
  shownav: false,
  blogid:"",
  setshownav: () => set((state) => {
    return {shownav: !state.shownav}
  }),
  showalert: false,
  setshowalert: (id) => set((state) => {
    return {showalert: !state.showalert,blogid:id}
  }),
  setblogid: () => {
    set({blogid:""})
  }

}));

export default useAuthstore;
