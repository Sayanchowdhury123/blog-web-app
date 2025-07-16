import { create } from "zustand";




const useAuthstore = create((set) => ({
  user: localStorage.getItem("user") || null,
  
  login: (user) => {
    localStorage.setItem("user", user);
    
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("user");

    set({ user: null });
  },
}));

export default useAuthstore;
