import React, { useState } from "react"

import EasyMarkdown from "~/components/common/EasyMarkdown"
import FeesTable from "~/components/common/FeesTable"
import DropdownArrow from "~/components/common/icons/DropdownArrow"
import "./index.css"

const FAQBox = props => {
  const [collapsed, setCollapsed] = useState(false)
  const toggleCollapse = () => setCollapsed(!collapsed)
  const markdownOptions = {
    overrides: { FeesTable }
  }
  return (
    <div className={"faq-box " + (collapsed && "faq-collapsed")}>
      <div
        className="title-container flex-container flex-align-center"
        onClick={toggleCollapse}
      >
        <h3 className="faq-box-title flex-0-1">{props.title}</h3>
        <DropdownArrow
          className="flex-0-1"
          direction={collapsed ? "down" : "up"}
        />
      </div>
      <div className="body">
        {props.body_lines.map((line, i) => (
          <EasyMarkdown
            type="p"
            className="body-line"
            key={i}
            options={markdownOptions}
          >
            {line}
          </EasyMarkdown>
        ))}
      </div>
    </div>
  )
}

export default FAQBox
