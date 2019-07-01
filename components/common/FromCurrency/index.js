import React from "react"
import { connect } from "react-redux"

import AddressInput from "../AddressInput"
import CurrencyDropdown from "../CurrencyDropdown"
import CurrencyTransactionDetails from "../CurrencyTransactionDetails"
import HorizontalLine from "../HorizontalLine"
import ValueInput from "../ValueInput"
import { currencyAbbrevs, tradeStages } from "~/lib/constants"
import actionTypes from "~/state/actionTypes"
import "./index.css"

const FromCurrency = props => {
  // page-conditional rendering
  let addressInput = null
  let transactionDetails = null
  if (props.page === "morph") {
    addressInput = (
      <AddressInput
        currency={props.currency}
        onChange={props.onAddressInputChange}
        type="refund"
        placeholder={`Your ${props.currency} refund deposit address`}
        value={props.address}
      />
    )
    if (tradeStages[props.tradeStage] > tradeStages.NOT_STARTED) {
      transactionDetails = (
        <CurrencyTransactionDetails
          open={true}
          rows={[
            {
              field: "refund address",
              value: props.address
            }
          ]}
        />
      )
    }
  }

  let valueCaption = "expected deposit"
  if (
    tradeStages[props.tradeStage] >=
    tradeStages.WAITING_FOR_DEPOSIT_CONFIRMATION
  ) {
    valueCaption = "received"
  }

  return (
    <div className="from-currency currency-bar" style={props.barStyle}>
      <div className="currency-bar-padding">
        <div className="above-line flex-container">
          <CurrencyDropdown
            currency={props.currency}
            dropdownClassName="dark-purple"
            hoverClass="dark-purple"
            locked={props.locked}
            onSelectCurrency={props.onSelectCurrency}
          />
        </div>
        <HorizontalLine className="currency-bar-divider" />
        <div className="locked-trade-value-group">
          <p className="trade-value">{props.amount}</p>
          <p className="value-caption">{valueCaption}</p>
        </div>

        <ValueInput
          amount={props.amount}
          direction="from"
          editable={!props.locked}
          label={currencyAbbrevs[props.currency]}
          lowerBound={0}
          units={currencyAbbrevs[props.currency]}
          upperBound={99999999999}
        />
        {addressInput}
      </div>
      {transactionDetails}
    </div>
  )
}

export default connect(
  state => {
    return {
      locked: state.tradeWidgetLocked,
      page: state.page,
      tradeStage: state.tradeStage,
      ...state.fromCurrency
    }
  },
  dispatch => {
    return {
      onAddressInputChange: e => {
        dispatch({
          type: actionTypes.SET_FROM_CURRENCY_RECEIVING_ADDRESS,
          payload: e.target.value
        })
      },
      onSelectCurrency: currency =>
        dispatch({
          type: actionTypes.SELECT_FROM_CURRENCY,
          payload: currency
        })
    }
  }
)(FromCurrency)
