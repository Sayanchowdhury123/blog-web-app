import axios from "axios";
import * as Sentry from "@sentry/react";


const api = axios.create({
    baseURL: `${import.meta.env.VITE_HTTP_API}/api`,
    withCredentials: false
})


export default api;