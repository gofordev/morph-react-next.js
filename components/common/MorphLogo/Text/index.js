import React from "react"

import { morph_logo as text_content } from "~/text/common/common"
import "./index.css"

const LogoText = props => (
  <p className={"logo-text " + (props.className || "")}>{text_content}</p>
)

export default LogoText
