import axios from "axios"


export const createAxios = axios.create({
    baseURL:"http://localhost:8040/api/v1",
    withCredentials:true
})
