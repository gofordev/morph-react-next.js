import React from "react"

import "./index.css"

const LogoImage = props => {
  let filename = "logo-mark"
  if (props.size === "medium") {
    filename = "logo-mark@2x"
  }
  if (props.size === "large") {
    filename = "logo-mark@3x"
  }
  return (
    <img
      className={"logo-image " + (props.className || "")}
      src={`/static/other_images/${filename}.png`}
    />
  )
}

export default LogoImage
