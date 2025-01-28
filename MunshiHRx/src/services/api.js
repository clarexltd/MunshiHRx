import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const API_URL = "http://192.168.90.238:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Set a 10-second timeout
})

const handleApiError = (error) => {
  console.error("API Error:", error)
  if (error.code === "ECONNABORTED") {
    console.error("Request timed out")
    throw new Error("The request timed out. Please check your internet connection and try again.")
  } else if (error.response) {
    console.error("Response data:", error.response.data)
    console.error("Response status:", error.response.status)
    console.error("Response headers:", error.response.headers)
    throw new Error(error.response.data.error || `Server error: ${error.response.status}`)
  } else if (error.request) {
    console.error("No response received:", error.request)
    throw new Error("No response from server. Please check your internet connection and server status.")
  } else {
    console.error("Error setting up the request:", error.message)
    throw new Error("Error setting up the request: " + error.message)
  }
}

export const checkUser = async (email) => {
  try {
    console.log("Checking user with email:", email)
    const response = await api.post("/auth/checkuser", { email })
    console.log("Check user response:", response.data)
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
    const token = await AsyncStorage.getItem("userToken")
    if (!token) {
      throw new Error("No user token found")
    }
    const response = await api.get("/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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
