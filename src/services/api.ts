import axios from "axios";

const api=axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    //baseURL: "http://10.26.57.174:8080",
    //baseURL: "http://localhost:8080",
});

export default api;
