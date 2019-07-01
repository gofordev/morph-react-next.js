import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import AddressInput from "../AddressInput"
import CurrencyDropdown from "../CurrencyDropdown"
import CurrencyTransactionDetails from "../CurrencyTransactionDetails"
import HorizontalLine from "../HorizontalLine"
import SVG from "../SVG"
import ValueInput from "../ValueInput"
import DropdownArrow from "../icons/DropdownArrow"
import { currencyAbbrevs, tradeStages } from "~/lib/constants"
import { formatAmount } from "~/lib/utils"
import actionTypes from "~/state/actionTypes"
import "./index.css"

const propTypes = {
  exchangeValue: PropTypes.number.isRequired,
  fromCurrencyAbbrev: PropTypes.string.isRequired
}

const ToCurrency = props => {
  const ifLocked = f => () => {
    if (props.locked) {
      f()
    }
  }

  // open state
  const [open, setOpen] = useState(false)
  const toggleOpen = ifLocked(() => {
    props.onToggleAccordion()
    setOpen(!open)
  })

  const [overflow, setOverflow] = useState("hidden")

  // zipped state (for animating in)
  const initialZippedState = props.parentRenderCount > 1 ? true : false
  // ^^ so they don't zip in on initial page load
  const [zipped, setZipped] = useState(initialZippedState)
  useEffect(() => {
    setTimeout(() => {
      setZipped(false)
    }, 25)
  }, [])

  const shrinkAndClose = e => {
    setZipped(true)
  }
  const onTransitionEnd = e => {
    if (e.propertyName === "transform") {
      if (zipped) {
        props.onCloseButtonClick()
      } else {
        setOverflow("visible")
      }
    }
  }
  // page-conditional rendering
  let addressInput = null
  if (props.page === "morph") {
    addressInput = (
      <AddressInput
        currency={props.currency}
        onChange={props.onAddressInputChange}
        type="deposit"
        value={props.address}
      />
    )
  }

  let transactionDetails = null
  if (tradeStages[props.tradeStage] > tradeStages.NOT_STARTED) {
    const rateToShow =
      tradeStages[props.tradeStage] < tradeStages.TRADED
        ? props.seen_rate
        : props.final_rate
    transactionDetails = (
      <CurrencyTransactionDetails
        open={open}
        rows={[
          {
            field: "receiving address",
            value: props.address
          },
          {
            field: "horizontalLine",
            value: null
          },
          {
            field:
              tradeStages[props.tradeStage] < tradeStages.TRADED
                ? "est. rate"
                : "final rate",
            value: `1 ${props.fromCurrencyAbbrev} > ${rateToShow}`
          },
          {
            field: "network fee",
            value: `${formatAmount(props.network_fee.fee, props.currency)} ${
              props.network_fee.flat ? "(flat)" : ""
            }`
          },
          {
            field: "transaction id",
            value: props.txid // won't render if undefined/null (before "TRADED" state)
          }
        ]}
      />
    )
  }

  let valueCaption = "est. amount"
  let tradeValue = parseFloat(props.exchangeValue.toFixed(4))
  if (tradeStages[props.tradeStage] >= tradeStages.TRADED) {
    valueCaption = "final amount"
    tradeValue = formatAmount(props.converted_amount, props.currency)
  }

  return (
    <div
      style={{
        backgroundColor: props.backgroundColor,
        overflow
      }}
      className={"to-currency currency-bar " + (zipped ? "zip-container" : "")}
      onClick={toggleOpen}
      onTransitionEnd={onTransitionEnd}
    >
      <div className={"currency-bar-padding " + (zipped ? "zipped" : "")}>
        <div className="above-line flex-container">
          <CurrencyDropdown
            className="flex-0-1"
            hoverClass={props.backgroundClass}
            dropdownClassName={props.backgroundClass}
            currency={props.currency}
            locked={props.locked}
            onSelectCurrency={props.onSelectCurrency}
          />
          <div className="locked-trade-value-group relative flex-0-1">
            <p className="trade-value">{tradeValue}</p>
            <p className="value-caption">{valueCaption}</p>
          </div>
          <button
            className={
              "close-button flex-0-1 " + (props.closeable ? "" : "hidden")
            }
            onClick={shrinkAndClose}
          >
            <SVG className="rotate-45" src="/static/icons/ui/cross.svg" />
          </button>
          <DropdownArrow
            className="transaction-details-dropdown-arrow"
            direction={open ? "up" : "down"}
          />
        </div>
        <HorizontalLine className="currency-bar-divider" />
        <div className="below-line">
          <div className="flex-container below-line-data">
            <div className="exchange-value-group flex-0-1">
              <div className="flex-container flex-align-center flex-0-1">
                <p className="flex-0-1 exchange-value">
                  {parseFloat(props.exchangeValue.toFixed(4))}
                </p>
                <p className="flex-0-1 exchange-value-units">
                  {currencyAbbrevs[props.currency]}
                </p>
              </div>
              <p className="exchange-value-tag">est. amount</p>
            </div>
            <div className="unlocked-only weight-group flex-container flex-align-center flex-0-1">
              <span className="weight flex-0-1">Weight</span>
              <ValueInput
                amount={props.weight}
                editable={props.editable}
                className="flex-0-1"
                direction="to"
                id={props.id}
                lowerBound={0}
                units="%"
                upperBound={100}
                width={props.weight > 99 ? "2.5em" : "2.25em"}
              />
            </div>
            <div className="locked-only weight-group locked-weights flex-container flex-align-center flex-0-1">
              <span className="flex-0-1">Weight</span>{" "}
              <span className="weight">{props.weight / 100}</span>{" "}
              <span>%</span>
            </div>
          </div>
        </div>
        {addressInput}
      </div>
      {transactionDetails}
    </div>
  )
}

ToCurrency.propTypes = propTypes

export default connect(
  (state, ownProps) => {
    const weight = parseInt(state.toCurrencies[ownProps.id].weight)
    const fromCurrencyAbbrev = currencyAbbrevs[state.fromCurrency.currency]
    const ownAbbrev = currencyAbbrevs[ownProps.currency]
    let exchangeRate
    if (ownAbbrev === fromCurrencyAbbrev) {
      exchangeRate = 1
    } else {
      exchangeRate =
        parseFloat(ownProps.seen_rate) ||
        state.tickerResponse.data[fromCurrencyAbbrev][ownAbbrev]
    }
    return {
      ...state.toCurrencies[ownProps.id],
      weight,
      exchangeValue:
        ((parseFloat(state.fromCurrency.amount) || 0) *
          parseFloat(exchangeRate) *
          weight) /
        100,
      locked: state.tradeWidgetLocked,
      page: state.page,
      tradeStage: state.tradeStage,
      fromCurrencyAbbrev
    }
  },
  (dispatch, ownProps) => {
    return {
      onAddressInputChange: e => {
        dispatch({
          type: actionTypes.SET_TO_CURRENCY_RECEIVING_ADDRESS,
          payload: {
            id: ownProps.id,
            address: e.target.value
          }
        })
      },
      onCloseButtonClick: () => {
        dispatch({
          type: actionTypes.REMOVE_TO_CURRENCY,
          payload: ownProps.id
        })
      },
      onToggleAccordion: () => {
        dispatch({
          type: actionTypes.SET_TRADE_WIDGET_HEIGHT,
          payload: Math.random()
        })
        // we're really using this as an `onresize` for the tradewidget
        // just want to trigger anything listening for a change in that
        // value to update itself when this accordion is toggled.
      },
      onSelectCurrency: currency =>
        dispatch({
          type: actionTypes.SELECT_TO_CURRENCY,
          payload: {
            id: ownProps.id,
            currency: currency
          }
        })
    }
  }
)(ToCurrency)
