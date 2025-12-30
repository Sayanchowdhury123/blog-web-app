import { create } from "zustand";
import api from "../axios";
import useAuthstore from "./authstore";

const ls = localStorage.getItem("user");
const localuser = JSON.parse(ls);

const useFollowingstore = create((set, get) => ({
  blogs: [],
  s: 0,
  l: 2,
  h: true,

  followingblogs: async () => {
     const {user} = useAuthstore.getState()
    if(!user) return;
    const { s, l } = get();
    const res = await api.get(`/home/followingpage?s=${s}&l=${l}`,{
         headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
 
    const newblogs = res.data.blogs?.filter((blog) => blog.approval === true);

    set((state) => {
      const merged = [...state.blogs, ...newblogs];
      const unique = merged.filter(
        (b, index, self) =>
          index === self.findIndex((other) => other._id === b._id)
      );
      return {
        s: s + l,
        l: l,
        h: res.data.h,
        blogs: unique,
      };
    });
  },
 


}));

export default useFollowingstore;