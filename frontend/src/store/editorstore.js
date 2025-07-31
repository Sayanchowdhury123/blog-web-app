import { create } from "zustand";
import api from "../axios";

const ls = localStorage.getItem("user");
const localuser = JSON.parse(ls);


const useEditorstore = create((set) => ({
  blogs:[],
  fetchall: async () => {
     const res = await api.get("/editor/fetch-all",{
       headers: {
          Authorization: `Bearer ${localuser.token}`,
        }
     })
     console.log(res.data);
     set({blogs: res.data})
  },
  approval: async (blogid) => {
    const res = await api.patch(`/editor/${blogid}/approval`)
      set((state) => (
       {blogs: state.blogs.map((b) => b._id === blogid ? res.data : b)}
        )) 
  }

}));

export default useEditorstore;