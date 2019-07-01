import React from "react"

import "./index.css"

const DropdownArrow = props => {
  let rotation
  let filename = "arrow.svg"
  if (props.type === "dot") {
    filename = "arrows-dot.svg"
  }
  switch (props.direction) {
    case "up":
      rotation = "rotate(-90deg)"
      break
    case "down":
      rotation = "rotate(90deg)"
      break
    case "left":
      rotation = "rotate(180deg)"
      break
    default:
      rotation = "rotate(0deg)"
  }
  return (
    <img
      style={{
        transform: rotation
      }}
      src={`/static/icons/ui/${filename}`}
      className={"dropdown-arrow " + props.className}
    />
  )
}
export default DropdownArrow
