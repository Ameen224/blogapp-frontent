// src/lib/api.js

import axios from "axios"
import { store } from "./store"
import { setCredentials, logout } from "./authSlice"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config
    if (err.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/user/refresh")) {
      originalRequest._retry = true
      try {
        const { data } = await api.get("/user/refresh")
        store.dispatch(setCredentials(data))
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        store.dispatch(logout())
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(err)
  },
)

export default api
