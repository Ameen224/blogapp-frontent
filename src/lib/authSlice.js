// src/lib/authSlice.js
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: null,
  admin: null,
  accessToken: null,
  adminAccessToken: null,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, user } = action.payload
      state.accessToken = accessToken
      state.user = user
      state.error = null
    },
    setAdminCredentials: (state, action) => {
      const { adminAccessToken, admin } = action.payload
      state.adminAccessToken = adminAccessToken
      state.admin = admin
      state.error = null
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
    clearCredentials: (state) => {
      state.user = null
      state.accessToken = null
      state.error = null
    },
    clearAdminCredentials: (state) => {
      state.admin = null
      state.adminAccessToken = null
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.admin = null
      state.accessToken = null
      state.adminAccessToken = null
      state.isLoading = false
      state.error = null
    },
  },
})

export const {
  setCredentials,
  setAdminCredentials,
  setLoading,
  setError,
  clearCredentials,
  clearAdminCredentials,
  clearError,
  logout,
} = authSlice.actions

export default authSlice.reducer

// Selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentAdmin = (state) => state.auth.admin
export const selectCurrentToken = (state) => state.auth.accessToken
export const selectCurrentAdminToken = (state) => state.auth.adminAccessToken
export const selectIsLoading = (state) => state.auth.isLoading
export const selectAuthError = (state) => state.auth.error
