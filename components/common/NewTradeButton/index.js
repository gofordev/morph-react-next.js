import React from "react"
import Link from "next/link"
import { connect } from "react-redux"

import CalloutButton from "../CalloutButton"
import { tradeStages } from "~/lib/constants"
import { new_trade_button as textContent } from "~/text/common/common"
import "./index.css"

const NewTradeButton = props => {
  let className = "callout-button new-trade-button"
  if (props.page === "morph") {
    if (tradeStages[props.tradeStage] <= tradeStages.NOT_STARTED) {
      className += " hidden"
    }
    if (tradeStages[props.tradeStage] >= tradeStages.COMPLETE_WITH_TXID) {
      className += " primary-action"
    }
  }
  return (
    <Link href="/morph">
      <CalloutButton
        className={`${className} ${props.className}`}
        title={textContent.title}
      />
    </Link>
  )
}

export default connect(({ page, tradeStage }) => ({ page, tradeStage }))(
  NewTradeButton
)
