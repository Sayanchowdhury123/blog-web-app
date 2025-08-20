import { create } from "zustand";
import api from "../axios";
import useAuthstore from "./authstore";

const ls = localStorage.getItem("user");
const localuser = JSON.parse(ls);

const useSearchstore = create((set, get) => ({
  blogs: [],
  l: 0,
  
  fetchinfo: async () => {
  
    const res = await api.get(`/sp/allblogs`);
    
    set({blogs: res.data})
  },
  search: async (st) => {
    const res = await api.get(`/sp/search?st=${st}`)
 
    set({blogs: res.data.results,l: res.data.count})
  }

}));

export default useSearchstore;