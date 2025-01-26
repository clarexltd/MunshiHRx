import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const API_URL = "http://10.0.2.2:3000/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

const handleApiError = (error) => {
  if (error.response) {
    throw new Error(error.response.data.error || `Server error: ${error.response.status}`)
  } else if (error.request) {
    throw new Error("No response from server. Please check your internet connection.")
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

export const getUserData = async (token) => {
  try {
    const response = await api.post(
      "/user/userdata",
      { token },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
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

