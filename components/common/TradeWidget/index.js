import React from "react"
import { connect } from "react-redux"

import Loader from "~/components/common/Loader"
import DepositFooter from "./DepositFooter"
import ErrorReadout from "./ErrorReadout"
import TradeWidgetFooter from "./TradeWidgetFooter"
import TradeWidgetHeader from "./TradeWidgetHeader"
import TradeWidgetLeft from "./TradeWidgetLeft"
import TradeWidgetRight from "./TradeWidgetRight"
import { tradeStages } from "~/lib/constants"
import "./index.css"

const TradeWidget = props => {
  let errorClass = ""
  let locked = false
  let lockedClass = ""

  const currentTradeStage = tradeStages[props.tradeStage]
  // change the footer if it's time to make a deposit
  let footer = <TradeWidgetFooter />
  if (currentTradeStage >= tradeStages.WAITING_FOR_DEPOSIT) {
    lockedClass = "locked"
    locked = true
    footer = <DepositFooter />
  }

  // add an error block if the trade has errored out
  let errorReadout = null
  if (currentTradeStage.type === "error") {
    errorClass = " error"
    errorReadout = <ErrorReadout refund={true} />
  }

  let toRender = <Loader />
  if (props.loaded) {
    toRender = (
      <>
        <TradeWidgetHeader
          currencyCount={Object.keys(props.toCurrencies).length}
        />
        {errorReadout}
        <div className="trade-widget-halves">
          <TradeWidgetLeft locked={locked} />
          <TradeWidgetRight
            editable={!locked}
            locked={locked}
            toCurrencies={props.toCurrencies}
          />
        </div>
        {footer}
      </>
    )
  }
  return (
    <div
      className={
        "trade-widget " +
        (lockedClass || "") +
        (props.loaded ? "" : " loading ") +
        errorClass
      }
    >
      {toRender}
    </div>
  )
}

export default connect(({ toCurrencies, tradeStage }) => ({
  toCurrencies,
  tradeStage
}))(TradeWidget)
