import axios from "axios"


export const createAxios = axios.create({
    baseURL:"https://connectionadda-backend.onrender.com/api/v1",
    withCredentials:true
})
