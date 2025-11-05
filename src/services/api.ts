import axios from "axios";

const api=axios.create({
    baseURL: "http://10.26.57.174:8080",
});

export default api;

