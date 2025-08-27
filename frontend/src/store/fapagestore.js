import { create } from "zustand";
import api from "../axios";
import useAuthstore from "./authstore";

const ls = localStorage.getItem("user");
const localuser = JSON.parse(ls);

const useFpagestore = create((set) => ({
  blogs: [],
  userinfo: {},
  fetchuserinfo: async (userid) => {
    const res = await api.get(`/fpage/${userid}`, {
      headers: {
        Authorization: `Bearer ${localuser.token}`,
      },
    });

    set({ blogs: res.data.blogs });
    set({ userinfo: res.data.userinfo });
  },
  fu: async (fid) => {
    const res = await api.patch(
      `/fpage/${fid}/uf/${localuser.id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localuser.token}`,
        },
      }
    );

    set((state) => {
      return {
        userinfo: {
          ...state.userinfo,
          followers: state.userinfo.followers?.includes(localuser.id)
            ? state.userinfo.followers.filter((f) => f !== localuser.id)
            : [...state.userinfo.followers, fid],
        },
      };
    });
  },
  showfollowers: false,
  setshowfollowers: () => {
    set((state) => {
      return {
        showfollowers: state.showfollowers === true ? false : true,
      };
    });
  },
  followerinfo: [],
  getfinfo: async (followerid) => {
     const res = await api.get(`/fpage/${followerid}/followers`, {
      headers: {
        Authorization: `Bearer ${localuser.token}`,
      },
    });
  
    
    set({followerinfo: res.data})
  },
    showfollowing: false,
  setshowfollowing: () => {
    set((state) => {
      return {
        showfollowing: state.showfollowing === true ? false : true,
      };
    });
  },

}));

export default useFpagestore;
