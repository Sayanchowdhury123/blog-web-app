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

 

}));

export default useHomestore;