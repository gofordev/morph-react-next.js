import React from "react"
import PropTypes from "prop-types"
import Router from "next/router"
import { connect } from "react-redux"

import CalloutButton from "../../CalloutButton"
import SplitAdder from "../../SplitAdder"
import { tradeStages, currencyAbbrevs } from "~/lib/constants"
import { initTrade } from "~/state/actionCreators"
import "./index.css"

const propTypes = {}

const TradeWidgetFooter = props => {
  let buttonClass, buttonSubtitle, buttonTitle, onButtonClick

  if (props.page === "home") {
    buttonTitle = "continue"
    onButtonClick = () => {
      const fromCurrencyString = `${props.fromCurrency.currency}_${props
        .fromCurrency.amount || 1}`
      const toCurrenciesString = Object.keys(props.toCurrencies)
        .map(
          id =>
            `${props.toCurrencies[id].currency}_${
              props.toCurrencies[id].weight
            }`
        )
        .join(",")
      Router.push(`/morph?i=${fromCurrencyString}&o=${toCurrenciesString}`)
    }
  }
  if (props.page === "morph") {
    switch (tradeStages[props.tradeStage]) {
      case tradeStages.NOT_STARTED: {
        buttonTitle = "start trade"
        onButtonClick = props.onInitTrade
        break
      }
    }
  }
  return (
    <div className="flex-container relative trade-widget-footer">
      <div className="bottom-left" />
      <SplitAdder
        className={Object.keys(props.toCurrencies).length >= 6 ? "hidden" : ""}
      />
      <CalloutButton
        onClick={onButtonClick}
        loading={props.tradeInFlight}
        className={`btnFillUp liquidbg continue primary-action upper ${buttonClass}`}
        title={buttonTitle}
        subtitle={buttonSubtitle}
      />
    </div>
  )
}

TradeWidgetFooter.propTypes = propTypes

export default connect(
  ({ fromCurrency, page, toCurrencies, tradeInFlight, tradeStage }) => ({
    fromCurrency,
    page,
    toCurrencies,
    tradeInFlight,
    tradeStage
  }),
  dispatch => ({
    dispatchTradeActions: (fromCurrency, toCurrencies) =>
      initTrade(fromCurrency, toCurrencies, dispatch)
  }),
  (stateProps, dispatchProps) => ({
    onInitTrade: () =>
      dispatchProps.dispatchTradeActions(
        stateProps.fromCurrency,
        stateProps.toCurrencies
      ),
    // ^^ i know this seems too complicated. it's one of the annoying corner
    // cases of redux, and without using redux-thunk this is the best i
    // could figure.
    ...stateProps,
    ...dispatchProps
  })
)(TradeWidgetFooter)
