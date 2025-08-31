import { create } from "zustand";
import api from "../axios";
import useAuthstore from "./authstore";
import toast from "react-hot-toast";

const ls = localStorage.getItem("user");
const localuser = JSON.parse(ls);

const useSearchstore = create((set, get) => ({
  blogs: [],
 
  fetchinfo: async () => {
  
    const res = await api.get(`/sp/allblogs`);
    
    set({blogs: res.data})
  },
  
   
  search: async (st) => {
    const res = await api.get(`/sp/search?st=${st}`)
  
      set({blogs: res.data || []})
       toast.success(`${res.data.length} results found`)
  },
  sorting: async (sv) => {
     if(sv){
     const res = await api.get(`/sp/sorting?sv=${sv}`)
      set({blogs: res.data})
     }
      
  }

}));

export default useSearchstore;