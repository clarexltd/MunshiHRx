import React from "react"
import Svg, { Circle, Path, Text } from "react-native-svg"

const Logo = (props) => (
  <Svg width={150} height={150} viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <Circle cx={75} cy={75} r={70} fill="#FF5D00" />
    <Path
      d="M45 60C45 51.716 51.716 45 60 45H90C98.284 45 105 51.716 105 60V90C105 98.284 98.284 105 90 105H60C51.716 105 45 98.284 45 90V60Z"
      fill="white"
    />
    <Text x={75} y={85} fontSize={40} fontWeight="bold" textAnchor="middle" fill="#FF5D00">
      MH
    </Text>
  </Svg>
)

export default Logo

