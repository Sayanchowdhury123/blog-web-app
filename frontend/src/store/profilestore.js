import { create } from "zustand";
import api from "../axios";
import useAuthstore from "./authstore";

const ls = localStorage.getItem("user");
const localuser = JSON.parse(ls);


const useProfilestore = create((set) => ({
  userinfo: {},
  fetchinfo: async () => {
    const res = await api.get(`/profile/${localuser.id}`, {
      headers: {
        Authorization: `Bearer ${localuser.token}`,
      },
    });

    set({ userinfo: res.data });
  },
  showedit: false,
  setshowedit: () => {
     set((state) => {
      return { showedit: !state.showedit};
    })
  },

  editp: async (formdata) => {
     const res = await api.patch(`/profile/${localuser.id}/updateprofile`,formdata, {
      headers: {
        Authorization: `Bearer ${localuser.token}`,
         "Content-Type": "multipart/form-data"
      },
    });
    set({ userinfo: res.data });
  }

}));

export default useProfilestore;