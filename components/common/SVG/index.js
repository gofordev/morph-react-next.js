import React from "react"

const SVG = props => (
  <img src={props.src} className={`svg ${props.className || ""}`} />
)

export default SVG
