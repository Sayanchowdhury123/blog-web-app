import { create } from "zustand";

const ls = localStorage.getItem("user")
const localuser = JSON.parse(ls)

const useAuthstore = create((set) => ({
  user: localuser || null,
  
  login: (user) => {
  
    localStorage.setItem("user",JSON.stringify(user));
    
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("user");

    set({ user: null });
  },
  shownav: false,
  setshownav: () => set((state) => {
    return {shownav: !state.shownav}
  })
}));

export default useAuthstore;
