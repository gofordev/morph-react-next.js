import React from "react"

import { currencyAbbrevs } from "~/lib/constants"
import "./index.css"

const RatesTableHeader = props => (
  <thead className="rates-table-header">
    <tr>
      {props.fields.map(field => (
        <th className="flex-container rates-table-field" key={field}>
          <p className="currency-name">{field}</p>
          <p className="currency-abbrev">{currencyAbbrevs[field]}</p>
        </th>
      ))}
    </tr>
  </thead>
)

export default RatesTableHeader
