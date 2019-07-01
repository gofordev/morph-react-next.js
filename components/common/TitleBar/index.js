import React from "react"

import "./index.css"

const TitleBar = props => (
  <div className="title-bar">
    <h1 className="title">{props.title}</h1>
    <p className="subtitle">{props.subtitle}</p>
    <p className="footnote">{props.footnote}</p>
  </div>
)

export default TitleBar
