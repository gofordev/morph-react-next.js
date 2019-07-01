import React, { useRef, useEffect, useState } from "react"
import { connect } from "react-redux"

import FromCurrency from "../../FromCurrency"
import useScrollPosition from "~/hooks/useScrollPosition"
import { tradeStages } from "~/lib/constants"
import "./index.css"

const TradeWidgetSectionLeft = props => {
  let className = "trade-widget-half left"
  if (tradeStages[props.tradeStage] > tradeStages.WAITING_FOR_DEPOSIT) {
    className += " deposit-received"
  }
  const containerEl = useRef(null)
  const [barStyle, setBarStyle] = useState({})
  const { y: scrollYPosition } = useScrollPosition()
  const adjustFromCurrencyPosition = () => {
    if (containerEl.current) {
      // al gore rhythm:
      // define the midpoint as half of the visible area of the
      // widget
      // set the `top` value to that midpoint, then translate up
      // to center the element
      const {
        top,
        bottom,
        left,
        height
      } = containerEl.current.getBoundingClientRect()
      let barStyle = {
        transform: "translateY(-50%)"
      }
      let visibleHeight
      if (top < 0) {
        // the top is out of view
        visibleHeight = height + top
        barStyle.top = Math.min(visibleHeight / 2 - top, height - 88.5) + "px"
        barStyle.transform = "translateY(-50%)"
      } else if (bottom > window.innerHeight) {
        // the bottom is out of view
        const outOfView = bottom - window.innerHeight
        visibleHeight = height - outOfView
        barStyle.top = Math.max(visibleHeight / 2, 150) + "px"
      } else {
        barStyle.top = height / 2
        barStyle.transform = "translateY(-50%)"
      }
      setBarStyle(barStyle)
    }
  }
  useEffect(adjustFromCurrencyPosition, [
    scrollYPosition,
    props.toCurrencies,
    props.tradeWidgetHeight
  ])
  return (
    <div className={className} ref={containerEl}>
      <FromCurrency barStyle={barStyle} />
      <div className="tw-left-clipping" />
      <div className="tw-left-clipping complete" />
    </div>
  )
}

export default connect(({ tradeStage, tradeWidgetHeight, toCurrencies }) => ({
  tradeStage,
  tradeWidgetHeight,
  toCurrencies
}))(TradeWidgetSectionLeft)
