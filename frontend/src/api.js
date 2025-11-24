import axios from "axios";

const api = axios.create({
  baseURL: "https://proyecto-fullstack-nfai.onrender.com/api",
});

export default api;
