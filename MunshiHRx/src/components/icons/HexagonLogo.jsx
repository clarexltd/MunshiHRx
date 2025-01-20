import React from "react"
import Svg, { Path } from "react-native-svg"

const HexagonLogo = ({ color = "#FFFFFF", size = 60 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M21 16.5v-9L12 3L3 7.5v9L12 21l9-4.5zM12 12V6.5m0 5.5v5.5m0-5.5l-5-2.5m5 2.5l5-2.5"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default HexagonLogo

