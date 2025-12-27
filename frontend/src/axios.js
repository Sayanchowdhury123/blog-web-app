import axios from "axios";
import * as Sentry from "@sentry/react";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: false
})


export default api;