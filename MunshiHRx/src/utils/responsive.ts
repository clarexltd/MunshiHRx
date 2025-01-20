import { Dimensions, PixelRatio } from "react-native"

const { width, height } = Dimensions.get("window")

// Base dimensions (you can adjust these based on your design's base device)
const baseWidth = 375
const baseHeight = 812

const scale = (size: number) => (width / baseWidth) * size
const verticalScale = (size: number) => (height / baseHeight) * size
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor

export { scale, verticalScale, moderateScale }

