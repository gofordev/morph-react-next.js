import QRCode from "qrcode.react"
import React from "react"
import { connect } from "react-redux"

import CalloutButton from "../../CalloutButton"
import EasyMarkdown from "../../EasyMarkdown"
import { initTrade } from "~/state/actionCreators"
import { currencyAbbrevs, tradeStages } from "~/lib/constants"
import { formatAmount } from "~/lib/utils"
import { deposit_footer as textContent } from "~/text/by-page/morph"
import "./index.css"

const DepositFooter = props => {
  const LabelAndValue = subProps => (
    <>
      <span className="label">{subProps.label} </span>
      <span className="value value-text">
        {" " + formatAmount(subProps.value, props.fromCurrency.currency)}
      </span>
      <span className="units value-text">
        {" " + currencyAbbrevs[props.fromCurrency.currency]}
      </span>
    </>
  )

  let headline = textContent.headline.initial
  let depositClass = "before-deposit"
  let calloutButton = null
  if (
    tradeStages[props.tradeStage] ===
    tradeStages.WAITING_FOR_DEPOSIT_CONFIRMATION
  ) {
    depositClass = "after-deposit"
    headline = textContent.headline.after_deposit
  }
  if (
    tradeStages[props.tradeStage] > tradeStages.WAITING_FOR_DEPOSIT_CONFIRMATION
  ) {
    depositClass = "after-deposit after-confirmation"
    headline = "Additional Information"
  }
  const sortedKeys = tradeStages.sortKeys()
  const lastKey = sortedKeys[sortedKeys.length - 1]
  // get last stage
  if (tradeStages[props.tradeStage] === tradeStages[lastKey]) {
    calloutButton = (
      <CalloutButton
        className="duplicate-trade callout-button"
        loading={props.tradeInFlight}
        onClick={props.duplicateTrade}
        title={textContent.duplicate_button.title}
        subtitle={textContent.duplicate_button.subtitle}
      />
    )
  }
  return (
    <div className={"deposit-footer " + depositClass}>
      <EasyMarkdown className="upper" type="h3">
        {headline}
      </EasyMarkdown>
      <div className="deposit-data flex-align-center flex-container">
        <QRCode
          className="flex-1"
          size={
            tradeStages[props.tradeStage] >=
            tradeStages.WAITING_FOR_DEPOSIT_CONFIRMATION
              ? 0
              : 200
          }
          value={props.deposit_address}
        />
        <div className="flex-1 deposit-figures">
          <p className="amount-received">
            <LabelAndValue label={"Received "} value={props.received} />
          </p>
          <p className="deposit-address-label label">Deposit Address</p>
          <p className="deposit-address">{props.deposit_address}</p>
          <div className="flex-container limits">
            <p className="flex-1 limit">
              <LabelAndValue label={"Min Deposit: "} value={props.minDeposit} />
            </p>
            <p className="flex-1 limit align-right">
              <LabelAndValue label={"Max Deposit: "} value={props.maxDeposit} />
            </p>
          </div>
        </div>
      </div>
      <div className="notes">
        <p>:::NOTES:::</p>
        <ul className="notes-list">
          {textContent.notes.map((note, i) => (
            <li key={note.substr(5, 12)}>
              <span className="ordinal">{i + 1}. </span>
              <EasyMarkdown type="span">{note}</EasyMarkdown>
            </li>
          ))}
        </ul>
      </div>
      {calloutButton}
    </div>
  )
}

export default connect(
  ({ fromCurrency, toCurrencies, tradeInFlight, tradeMeta, tradeStage }) => ({
    fromCurrency,
    toCurrencies,
    tradeInFlight,
    tradeStage,
    ...tradeMeta
  }),
  dispatch => ({
    dispatchDuplicateTrade: (fromCurrency, toCurrencies) =>
      initTrade(fromCurrency, toCurrencies, dispatch)
  }),
  (stateProps, dispatchProps) => ({
    duplicateTrade: () =>
      dispatchProps.dispatchDuplicateTrade(
        stateProps.fromCurrency,
        stateProps.toCurrencies
      ),
    ...stateProps,
    ...dispatchProps
  })
)(DepositFooter)
