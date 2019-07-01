import React from "react"

import HorizontalLine from "../HorizontalLine"
import { truthyOrZero } from "~/lib/utils"
import "./index.css"

const CurrencyTransactionDetails = props => {
  const maxHeight = (props.rows.length + 1) * (14 + 24) + "px"

  return (
    <div
      className={`currency-transaction-details currency-bar-padding
                ${props.className || ""}
                ${props.open ? "open" : "closed"}`}
      style={{ maxHeight: props.open ? maxHeight : "0" }}
    >
      {props.rows.map((pairObj, i) => {
        if (pairObj.field === "horizontalLine") {
          return <HorizontalLine key={"horizontal-line-" + i} />
        }
        if (!truthyOrZero(pairObj.value)) {
          return null
        }
        return (
          <div className="field-and-value flex-container" key={pairObj.field}>
            <p className="field">{pairObj.field}</p>
            <p className="value">{pairObj.value}</p>
          </div>
        )
      })}
    </div>
  )
}

CurrencyTransactionDetails.propTypes = {}

export default CurrencyTransactionDetails
