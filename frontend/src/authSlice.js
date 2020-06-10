import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
  isUserLoggedIn: false,
  username: "",
}

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      const user = action.payload

      if (!user) return alert("Login failed. Incorrect username or password.")

      state.username = user.username
      state.isUserLoggedIn = true
    },
    logout: (state, action) => {
      state.username = ""
      state.isUserLoggedIn = false
      window.localStorage.removeItem("token")
    },
    signup: (state, action) => {
      const user = action.payload

      if (!user) return alert("Sign up failed. Please try again.")

      state.username = user.username
      state.isUserLoggedIn = true
    },
  },
})

export const tryLogin = (username, password) => {
  return async dispatch => {
    try {
      const response = await axios.post("/api/auth/login", {
        username: username,
        password: password,
      })

      const user = {
        token: response.headers["auth-token"],
        username: response.data.username,
      }

      window.localStorage.setItem("token", response.headers["auth-token"])

      dispatch(login(user))
    } catch (e) {
      alert("Incorrect Username/Password.")
    }
  }
}

export const trySignup = (username, password) => {
  return async dispatch => {
    try {
      const response = await axios.post("/api/auth/signup", {
        username: username,
        password: password,
      })

      const user = {
        token: response.headers["auth-token"],
        username: response.data.username,
      }

      window.localStorage.setItem("token", response.headers["auth-token"])

      dispatch(signup(user))
    } catch (e) {
      alert(e.response.data.msg[0].message)
    }
  }
}

export const selectorAuth = state => state.auth
export const { login, logout, signup } = authSlice.actions
export default authSlice.reducer
