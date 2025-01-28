import { useQuery } from "@tanstack/react-query"
import { getUserData } from "../services/api"

export const useUserData = () => {
  return useQuery({
    queryKey: ["userData"],
    queryFn: getUserData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 60 * 60 * 1000, // 1 hour (formerly cacheTime)
    retry: 3, // Retry 3 times before failing
    onError: (error) => {
      console.error("Error fetching user data:", error)
    },
  })
}

