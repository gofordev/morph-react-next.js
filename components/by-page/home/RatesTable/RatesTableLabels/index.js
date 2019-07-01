import React from "react"

import "./index.css"

const RatesTableRowLabels = props => (
  <div className="rates-table-labels">
    {props.labels.map(label => (
      <p className="rates-table-row-label" key={label}>
        {label}
      </p>
    ))}
  </div>
)

export default RatesTableRowLabels
