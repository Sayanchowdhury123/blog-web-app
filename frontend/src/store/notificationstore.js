import { create } from "zustand";
import api from "../axios";
import useAuthstore from "./authstore";

const ls = localStorage.getItem("user");
const localuser = JSON.parse(ls);

const useNotificationstore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  fetchnotifications: async () => {
    try {
      const res = await api.get("/notify/get-notification", {
        headers: {
          Authorization: `Bearer ${localuser.token}`,
        },
      });
       const unread = res.data?.filter((n) => n.read === false)?.length;
      set({ notifications: res.data,unreadCount: unread });
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useNotificationstore;
