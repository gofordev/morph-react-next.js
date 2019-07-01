import moment from "moment"
import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import TradeTracker from "../TradeTracker"
import { tradeStages } from "~/lib/constants"
import { trade_widget as textContent } from "~/text/by-page/morph"
import "./index.css"

const propTypes = {
  currencyCount: PropTypes.number.isRequired
}

const numerals = "zero one two three four five six".split(" ")

const TradeWidgetHeader = props => {
  let tradeTracker = null
  if (props.page === "morph") {
    tradeTracker = <TradeTracker className="flex-0-1" />
  }
  let className = "trade-widget-header"
  if (tradeStages[props.tradeStage] === tradeStages.COMPLETE_WITH_TXID) {
    className += " trade-complete"
  }
  return (
    <div className={className}>
      <div className="trade-metadata">
        <p className="timestamp">
          Initiated: {moment(props.tradeMeta.created_at).format("L [|] LT")}
        </p>
        <h3 className="morph-id">Morph ID #{props.tradeMeta.id}</h3>
      </div>
      {tradeTracker}
      <div className="flex-container trade-widget-titles">
        <div className="flex-0-1">
          {textContent.heading_left.split(" ").map(line => (
            <h3 className="left" key={line}>
              {line}
            </h3>
          ))}
        </div>
        <div className="flex-0-1 align-right">
          {textContent.heading_right.split(" ").map(line => (
            <h3 className="right" key={line}>
              {line}
            </h3>
          ))}
          <h3 className="right">{numerals[props.currencyCount]}</h3>
        </div>
      </div>
      <div className="micro-titles flex-container">
        <h3 className="flex-1 left">to</h3>
        <h3 className="flex-1 align-right">from</h3>
      </div>
    </div>
  )
}

TradeWidgetHeader.propTypes = propTypes

export default connect(({ page, tradeMeta, tradeStage }) => ({
  page,
  tradeMeta,
  tradeStage
}))(TradeWidgetHeader)
