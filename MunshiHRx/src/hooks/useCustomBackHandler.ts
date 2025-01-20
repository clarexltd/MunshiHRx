import { useEffect } from "react"
import { BackHandler } from "react-native"
import { useNavigation } from "@react-navigation/native"

type BackHandlerType = "exit" | "goBack" | "custom"

export const useCustomBackHandler = (type: BackHandlerType, customAction?: () => boolean) => {
  const navigation = useNavigation()

  useEffect(() => {
    const backAction = () => {
      switch (type) {
        case "exit":
          BackHandler.exitApp()
          return true
        case "goBack":
          if (navigation.canGoBack()) {
            navigation.goBack()
            return true
          }
          return false
        case "custom":
          return customAction ? customAction() : false
        default:
          return false
      }
    }

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)

    return () => backHandler.remove()
  }, [navigation, type, customAction])
}

