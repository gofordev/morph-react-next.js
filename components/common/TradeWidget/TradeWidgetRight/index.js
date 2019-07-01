import React, { useEffect, useRef } from "react"
import { connect } from "react-redux"

import ToCurrency from "../../ToCurrency"
import { purples } from "~/lib/constants"
import "./index.css"

const TradeWidgetSectionRight = props => {
  // designed to max at 24px, with a width of approx 550px
  let closeable = true
  let editable = props.editable
  if (Object.keys(props.toCurrencies).length === 1) {
    closeable = false
    editable = false
  }
  const renderCount = useRef(0)
  renderCount.current++
  return (
    <div className="trade-widget-half right">
      <div className="to-currencies">
        {Object.keys(props.toCurrencies).map((id, i) => {
          return (
            <ToCurrency
              backgroundClass={`purple-bg-${i} lighter`}
              backgroundColor={purples[i]}
              closeable={closeable}
              editable={editable}
              locked={props.locked}
              parentRenderCount={renderCount.current}
              id={id}
              key={id}
              {...props.toCurrencies[id]}
            />
          )
        })}
      </div>
    </div>
  )
}

export default TradeWidgetSectionRight
