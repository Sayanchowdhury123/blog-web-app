import { create } from "zustand";
import api from "../axios";
import useAuthstore from "./authstore";

const ls = localStorage.getItem("user");
const localuser = JSON.parse(ls);

const useFpagestore = create((set) => ({
  blogs: [],
  userinfoi: {},
  fetchuserinfo: async (userid) => {
    const res = await api.get(`/fpage/${userid}`, {
      headers: {
        Authorization: `Bearer ${localuser.token}`,
      },
    });

    set({ blogs: res.data.blogs });
    set({ userinfoi: res.data.userinfo });
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
        userinfoi: {
          ...state.userinfoi,
          followers: state.userinfoi.followers?.includes(localuser.id)
            ? state.userinfoi.followers.filter((f) => f !== localuser.id)
            : [...state.userinfoi.followers, fid],
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
