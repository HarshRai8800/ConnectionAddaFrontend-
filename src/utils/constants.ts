import axios from "axios"


export const createAxios = axios.create({
    baseURL:"https://connectionadda-backend.onrender.com",
    withCredentials:true
})
