import { create } from "zustand";
import api from "../axios";
import useAuthstore from "./authstore";

const ls = localStorage.getItem("user");
const localuser = JSON.parse(ls);

const useHomestore = create((set, get) => ({
  blogs: [],
  s: 0,
  l: 2,
  h: true,

  fetchinfo: async () => {
    const { s, l } = get();
    const res = await api.get(`/home/allblogs?s=${s}&l=${l}`);
    const newblogs = res.data.blogs?.filter((blog) => blog.approval === true);

    set((state) => {
      const merged = [...state.blogs, ...newblogs];
      const unique = merged.filter(
        (b, index, self) =>
          index === self.findIndex((other) => other._id === b._id)
      );
      return {
        s: s + l,
        l: l,
        h: res.data.h,
        blogs: unique,
      };
    });
  },
  comid: "",
  setcomid: (id) => {
    set({ comid: id });
  },
  cid: null,

  togglelike: async (id) => {
    const res = await api.patch(
      `/home/${id}/likes/${localuser.id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localuser.token}`,
        },
      }
    );

    set((state) => {
      return {
        blogs: state.blogs.map((b) =>
          b._id === id ? { ...b, likes: [...b.likes, localuser.id] } : b
        ),
      };
    });
  },
  removelike: async (id) => {
    const res = await api.patch(
      `/home/${id}/rlikes/${localuser.id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localuser.token}`,
        },
      }
    );

    set((state) => {
      return {
        blogs: state.blogs.map((b) =>
          b._id === id
            ? { ...b, likes: b.likes.filter((id) => id !== localuser.id) }
            : b
        ),
      };
    });
  },

  commentsByBlog: {},
  fetchComments: async (blogId) => {
    const blogState = get().commentsByBlog[blogId] || {
      comments: [],
      skip: 0,
      limit: 3,
      hasMore: true,
    };

    if (!blogState.hasMore) return;

    const res = await api.get(
      `/home/${blogId}/comments?skip=${blogState.skip}&limit=${blogState.limit}`,
      {
        headers: { Authorization: `Bearer ${localuser.token}` },
      }
    );

    set((state) => ({
      commentsByBlog: {
        ...state.commentsByBlog,
        [blogId]: {
          comments: [...blogState.comments, ...res.data.comments],
          skip: blogState.skip + blogState.limit,
          limit: blogState.limit,
          hasMore: res.data.hasmore,
        },
      },
    }));
  },

  addComment: async (blogId, text) => {
    const res = await api.patch(
      `/home/${blogId}/add-comment/${localuser.id}`,
      { text },
      {
        headers: { Authorization: `Bearer ${localuser.token}` },
      }
    );
    
    
   

    set((state) => {
      const blogState = state.commentsByBlog[blogId] || {
        comments: [],
        skip: 0,
        limit: 3,
        hasMore: true,
      };

      return {
        commentsByBlog: {
          ...state.commentsByBlog,
          [blogId]: {
            ...blogState,
            comments: [res.data, ...blogState.comments],
          },
        },
        
      };
    });
  },

  delcom: async (blogid, commentid) => {
    const res = await api.delete(
      `/home/${blogid}/comments/${localuser.id}/del/${commentid}`,
      {
        headers: { Authorization: `Bearer ${localuser.token}` },
      }
    );

    set((state) => {
      const blogState = state.commentsByBlog[blogid];

      return {
        commentsByBlog: {
          ...state.commentsByBlog,
          [blogid]: {
            ...blogState,
            comments: blogState.comments.filter((c) => c._id !== commentid),
          },
        },
      };
    });
  },

  editcom: async (blogid, editid, newComment) => {
    const res = await api.patch(
      `/home/${blogid}/comments/${localuser.id}/edit/${editid}`,
      { text: newComment },
      {
        headers: { Authorization: `Bearer ${localuser.token}` },
      }
    );

    set((state) => {
      const blogState = state.commentsByBlog[blogid];

      return {
        commentsByBlog: {
          ...state.commentsByBlog,
          [blogid]: {
            ...blogState,
            comments: blogState.comments.map((c) =>
              c._id === editid ? { ...c, text: newComment } : c
            ),
          },
        },
      };
    });
  },
  trendingblogs: [],
  fetcht: async () => {
    const res = await api.get(`/home/trnding`);
    set({ trendingblogs: res.data });
  },
  pa: [],
  fetchpa: async () => {
    const res = await api.get(`/home/pa`);

    set({ pa: res.data });
  },
  recomdations: [],
  fetchr: async () => {
    const res = await api.get(`/profile/${localuser.id}/recom`, {
      headers: { Authorization: `Bearer ${localuser.token}` },
    });

    set({ recomdations: res.data });
  },
  searchedblog: [],
  search: async (searchtext) => {
    const res = await api.post(`/home/search`, { searchtext: searchtext });
    set({ searchedblog: res.data });
    console.log(res.data);
  },
  editorpicks: [],
  fetchep: async () => {
    const res = await api.get(`/editor/epblog-fetch`);

    set({ editorpicks: res.data });
  },
 
}));

export default useHomestore;
