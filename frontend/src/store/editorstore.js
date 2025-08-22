import { create } from "zustand";
import api from "../axios";
import useAuthstore from "./authstore";

const ls = localStorage.getItem("user");
const localuser = JSON.parse(ls);

const useEditorstore = create((set) => ({
  blogs: [],
  fetchall: async () => {
    const res = await api.get("/editor/fetch-all", {
      headers: {
        Authorization: `Bearer ${localuser.token}`,
      },
    });

    set({ blogs: res.data });
  },
  bloginfo: "",
  approveblog: async (blogid) => {
    const res = await api.patch(
      `/editor/${blogid}/approval`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localuser.token}`,
        },
      }
    );
    set((state) => {
     return {blogs: state.blogs.map((b) => (b._id === blogid ? res.data : b)),bloginfo: res.data} 
    });
  },
  setbid: () => {
    set({bid: ""})
  },
  epblog: async (blogid) => {
    const res = await api.patch(
      `/editor/${blogid}/epblog`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localuser.token}`,
        },
      }
    );
    set((state) => {
     return {blogs: state.blogs.map((b) => (b._id === blogid ? res.data : b)),bloginfo: res.data} 
    });
  },


}));

export default useEditorstore;
