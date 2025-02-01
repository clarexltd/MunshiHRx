import { useState, useEffect } from "react"
import { getUserData } from "../services/api"

export const useUserData = () => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserData()
        setData(userData)
        setIsLoading(false)
      } catch (err) {
        setError(err)
        setIsLoading(false)
        console.error("Error fetching user data:", err)
      }
    }

    fetchData()
  }, [])

  const refetch = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const userData = await getUserData()
      setData(userData)
      setIsLoading(false)
    } catch (err) {
      setError(err)
      setIsLoading(false)
      console.error("Error refetching user data:", err)
    }
  }

  return { data, isLoading, error, refetch }
}

