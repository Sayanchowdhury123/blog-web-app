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
      const unread = res.data.filter((n) => !n.read);
      set({ notifications: unread, unreadCount: unread?.length });
    } catch (error) {
      console.log(error);
    }
  },
  markasread: async () => {
    try {
      const res = await api.put(
        "/notify/banr",
        {},
        {
          headers: {
            Authorization: `Bearer ${localuser.token}`,
          },
        }
      );
     
      set((state) => {
       
const updated = state.notifications.map((n) => ({
          ...n,
          read: true,
        }));
      
        return {
          notifications: updated,
          unreadCount: 0,
        };
      });
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useNotificationstore;
