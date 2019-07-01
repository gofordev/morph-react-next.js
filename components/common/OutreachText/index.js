import React from "react"

import EasyMarkdown from "../EasyMarkdown"
import { outreach_text as text_content } from "~/text/common/common"
import "./index.css"

const OutreachText = props => (
  <div
    className={"bg-center bg-cover outreach-text " + (props.className || "")}
  >
    {props.children}
    <div className="text-container">
      {text_content.lines.map(line => (
        <EasyMarkdown key={line.substr(0, 12)} type="p">
          {line}
        </EasyMarkdown>
      ))}
    </div>
  </div>
)

export default OutreachText
