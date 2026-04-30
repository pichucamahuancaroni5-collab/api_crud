import axios from "axios";

const API = axios.create({
  baseURL: "https://api-crud-backend.onrender.com/api"
});

export default API;