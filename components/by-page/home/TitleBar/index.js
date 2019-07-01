import React from "react"

import "./index.css"

const TitleBar = props => (
  <div className="title-bar">
    <div className="title">
      <h1 className="left">{props.title_left}</h1>
      <h1 className="right">{props.title_right}</h1>
    </div>
    <div className="subtitle">
      <p className="left">{props.subtitle_left}</p>
      <p className="right">{props.subtitle_right}</p>
    </div>
  </div>
)

export default TitleBar
