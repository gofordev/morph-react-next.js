import React from "react"

import "./index.css"

const Loader = props => (
  <div className={"loader " + (props.className || "")}>
    <img src={props.src || "/static/gifs/morph-loading-animation.gif"} />
  </div>
)

export default Loader
