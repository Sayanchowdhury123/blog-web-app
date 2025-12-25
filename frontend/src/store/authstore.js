import { create } from "zustand";
import api from "../axios";
import useProfilestore from "./profilestore";

const ls = localStorage.getItem("user");
const localuser = JSON.parse(ls);

const useAuthstore = create((set) => ({
  user: localuser || null,

  login: (user) => {
    localStorage.setItem("user", JSON.stringify(user));

    set({ user });
  },
  logout: () => {
    localStorage.removeItem("user");

    set({ user: null });
    useProfilestore.getState().resetProfile();
  },
  shownav: false,
  blogid: "",
  setshownav: () =>
    set((state) => {
      return { shownav: state.shownav === true ? false : true };
    }),
  showalert: false,
  setshowalert: (id) =>
    set((state) => {
      return { showalert: !state.showalert, blogid: id };
    }),
  setblogid: () => {
    set({ blogid: "" });
  },
  showedit: false,
  bloginfo: "",
  setshowedit: (id, b) =>
    set((state) => {
      return { showedit: !state.showedit, blogid: id, bloginfo: b };
    }),
}));

export default useAuthstore;
