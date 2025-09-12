import { create } from "zustand";
import api from "../axios";
import useAuthstore from "./authstore";
import toast from "react-hot-toast";

const ls = localStorage.getItem("user");
const localuser = JSON.parse(ls);

const useSearchstore = create((set, get) => ({
  blogs: [],
  sh: [],
  allblog: [],
  load: false,
  setload: (value) => {
    set({ load: value });
  },

  fetchinfo: async () => {
    const res = await api.get(`/sp/allblogs`);
    set({ allblog: res.data });
    set({ blogs: res.data });
  },

  search: async (st) => {
    const {setload} = get()
    setload(true)
    try {
        const res = await api.get(`/sp/search?st=${st}`);

    set({ blogs: res.data || [] });
    toast.success(`${res.data.length} results found`);
    } catch (error) {
      console.log(error);
    }finally{
      setload(false)
    }
  
  },
  sorting: async (sv) => {
    if (sv) {
      const res = await api.get(`/sp/sorting?sv=${sv}`);
      set({ blogs: res.data });
    }
  },
  addsh: async (st) => {
    const res = await api.patch(
      `/sp/addsh`,
      { searchtext: st },
      {
        headers: {
          Authorization: `Bearer ${localuser.token}`,
        },
      }
    );
  },
  getsh: async () => {
    const res = await api.get(`/sp/getsh`, {
      headers: {
        Authorization: `Bearer ${localuser.token}`,
      },
    });

    set({ sh: res.data });
  },
  fopen: false,
  setfopen: () => {
    set((state) => {
      return {
        fopen: state.fopen === true ? false : true,
      };
    });
  },
  filters: {
    creators: [],
    tags: [],
    editorpicks: null,
  },
  togglefilters: (key, value) => {
    set((state) => {
      if (key === "editorpicks") {
        return {
          filters: {
            ...state.filters,
            editorpicks: value,
          },
        };
      }
      const values = state.filters[key] || [];
      const exists = values?.includes(value);

      return {
        filters: {
          ...state.filters,
          [key]: exists
            ? values.filter((v) => v !== value)
            : [...values, value],
        },
      };
    });
  },

  fetchfilteredblogs: async () => {
    const { setload } = get();
    setload(true);
    try {
      const { filters, allblog, fetchinfo } = get();
      const queryparams = new URLSearchParams();
      if (filters.creators.length > 0) {
        queryparams.append("creators", filters.creators.join(","));
      }
      if (filters.tags.length > 0) {
        queryparams.append("tags", filters.tags.join(","));
      }
      if (filters.editorpicks !== null) {
        queryparams.append("editorpicks", filters.editorpicks);
      }

      if (
        filters.editorpicks !== true &&
        filters.creators.length === 0 &&
        filters.tags.length === 0
      ) {
        fetchinfo();
      } else {
        const res = await api.get(`/sp/filter?${queryparams.toString()}`);
        set({ blogs: res.data });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setload(false);
    }
  },
}));

export default useSearchstore;
