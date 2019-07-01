import React from "react"

import "./index.css"

const Warning = props => (
  <img
    className={"warning-icon " + (props.className || "")}
    src="/static/icons/ui/warning.svg"
  />
)

export default Warning
