import { create } from "zustand";
import api from "../axios";
import useAuthstore from "./authstore";


const ls = localStorage.getItem("user");
const localuser = JSON.parse(ls);

const useProfilestore = create((set,get) => ({
  userinfo: {},
  savedblogs: [],
  ui:{},
  fetchuser: async () => {
    const res = await api.get(`/profile/${localuser.id}`, {
      headers: {
        Authorization: `Bearer ${localuser.token}`,
      },
    });

    set({ userinfo: res.data });
    set({ui: res.data})
  },
  showedit: false,
  setshowedit: () => {
    set((state) => {
      return { showedit: !state.showedit };
    });
  },

  editp: async (formdata) => {
    const res = await api.patch(
      `/profile/${localuser.id}/updateprofile`,
      formdata,
      {
        headers: {
          Authorization: `Bearer ${localuser.token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    set({ userinfo: res.data });
  },

  tblog: async (blogid) => {
    const res = await api.patch(
      `/profile/${blogid}/togglesave/${localuser.id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localuser.token}`,
        },
      }
    );


    set((state) => {
      const alreadysaved = state.userinfo.savedblogs.some(
        (sb) => sb === blogid
      );
      return {
        userinfo: {
          ...state.userinfo,
          savedblogs: alreadysaved
            ? state.userinfo.savedblogs.filter((sb) => sb !== blogid)
            : [...state.userinfo.savedblogs, blogid],
        },savedblogs: state.savedblogs.filter((b) => b._id !== blogid)
      };
    });
  },
   page:1,
  hasmore: true,
  load: false,
  getsavedblogs: async () => {
    const res = await api.get(`/profile/${localuser.id}/savedblogs`, {
      headers: {
        Authorization: `Bearer ${localuser.token}`,
      },
    });
   

    set((state) => {
      return{
        savedblogs: res.data,
       

      }
    })
  },
 

}));

export default useProfilestore;
