import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert } from "react-native"

const API_URL = "http://192.168.90.238:3000/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Set a 10-second timeout
})

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      await AsyncStorage.removeItem("userToken")
      Alert.alert("Session Expired", "Your session has expired. Please log in again.")
      // Navigate to login screen (you'll need to implement this navigation)
    }
    return Promise.reject(error)
  },
)

const handleApiError = (error) => {
  console.error("API Error:", error)
  if (error.code === "ECONNABORTED") {
    throw new Error("The request timed out. Please check your internet connection and try again.")
  } else if (error.response) {
    throw new Error(error.response.data.error || `Server error: ${error.response.status}`)
  } else if (error.request) {
    throw new Error("No response from server. Please check your internet connection and server status.")
  } else {
    throw new Error("Error setting up the request: " + error.message)
  }
}

export const checkUser = async (email) => {
  try {
    const response = await api.post("/auth/checkuser", { email })
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password })
    await AsyncStorage.setItem("userToken", response.data.token)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const setPassword = async (email, newPassword) => {
  try {
    const response = await api.post("/auth/setpassword", { email, newPassword })
    await AsyncStorage.setItem("userToken", response.data.token)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const requestOTP = async (email) => {
  try {
    const response = await api.post("/otp/sendotp", { email })
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post("/otp/verifyotp", { email, otp })
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const getUserData = async () => {
  try {
    const response = await api.get("/user/profile")
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout")
    await AsyncStorage.removeItem("userToken")
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export const validateToken = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken")
    if (!token) {
      return false
    }
    const response = await api.post("/auth/validate", { token })
    return response.data.valid
  } catch (error) {
    console.error("Token validation error:", error)
    return false
  }
}

