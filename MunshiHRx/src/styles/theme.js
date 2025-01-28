import { Platform } from "react-native"

export const fonts = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
}

export const typography = {
  header: {
    fontFamily: fonts.semiBold,
    fontSize: 24,
  },
  subheader: {
    fontFamily: fonts.medium,
    fontSize: 16,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  button: {
    fontFamily: fonts.medium,
    fontSize: 16,
  },
}

