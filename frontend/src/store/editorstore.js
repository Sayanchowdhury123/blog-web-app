import { create } from "zustand";
import api from "../axios";
import useAuthstore from "./authstore";
import toast from "react-hot-toast";

const ls = localStorage.getItem("user");
const localuser = JSON.parse(ls);

const useEditorstore = create((set) => ({
  blogs: [],
  fetchall: async () => {
    const { user } = useAuthstore.getState();
    if (!user) return;
    const res = await api.get("/editor/fetch-all", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    
      set({ blogs: res.data })
    
  },
  bloginfo: "",
  approveblog: async (blogid) => {
    const { user } = useAuthstore.getState();
    if (!user) return;
    const res = await api.patch(
      `/editor/${blogid}/approval`,
      {},
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    set((state) => {
      return {
        blogs: state.blogs.map((b) => (b._id === blogid ? res.data : b)),
        bloginfo: res.data,
      };
    });
  },
  setbid: () => {
    set({ bid: "" });
  },
  epblog: async (blogid) => {
    const { user } = useAuthstore.getState();
    if (!user) return;
    const res = await api.patch(
      `/editor/${blogid}/epblog`,
      {},
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    set((state) => {
      return {
        blogs: state.blogs.map((b) => (b._id === blogid ? res.data : b)),
        bloginfo: res.data,
      };
    });
  },
  notjoin: async (b) => {
    try {
      const { user } = useAuthstore.getState();
      if (!user) return;
      const res = await api.patch(
        `/blogs/${b._id}/end-collab`,
        { blogid: b._id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      set((state) => {
        return {
          blogs: state.blogs.filter((blog) => blog._id !== b._id),
        };
      });
    } catch (error) {
      toast.error(error.response?.data?.msg || "Something went wrong");
    }
  },
}));

export default useEditorstore;
