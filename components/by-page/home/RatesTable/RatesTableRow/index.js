import React from "react"
import PropTypes from "prop-types"

import RatesTableCell from "../RatesTableCell"
import "./index.css"

const RatesTableRow = props => (
  <tr className="rates-table-row">
    {props.fields.map(field => (
      <RatesTableCell
        key={field}
        value={field === props.label ? 1 : parseFloat(props.data[field])}
      />
    ))}
  </tr>
)

RatesTableRow.propTypes = {
  data: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired
}

export default RatesTableRow
