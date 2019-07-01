import React from "react"
import { connect } from "react-redux"
import queryString from "query-string"

import MorphContents from "../MorphContents"
import { tradeStages } from "~/lib/constants"
import { createEmitter, messageTypes } from "~/lib/socket-service"
import { getStoredAddresses } from "~/lib/storage"
import { handleTickerResponse } from "~/state/actionCreators"
import actionTypes from "~/state/actionTypes"
import "./index.css"

const MorphPage = props => {
  const widgetReady = !!Object.keys(props.ratesData).length
  return (
    <MorphContents
      onMount={[
        props.dispatchStoredAddresses,
        props.subscribeToTicker,
        props.syncURLToStore
      ]}
      widgetReady={widgetReady}
    />
  )
}

MorphPage.propTypes = {}

export default connect(
  state => {
    return {
      ratesData: state.tickerResponse.data
    }
  },
  (dispatch, ownProps) => {
    return {
      dispatchStoredAddresses: () => {
        dispatch({
          type: actionTypes.BATCH_SET_ADDRESSES,
          payload: getStoredAddresses()
        })
      },
      subscribeToTicker: () => {
        const tickerEmitter = createEmitter()
        return tickerEmitter.subscribe(messageTypes.TICKER_UPDATE, payload =>
          handleTickerResponse(payload, dispatch)
        )
      },
      syncURLToStore: () => {
        const url = ownProps.router.asPath
        const search = url.substring(url.indexOf("?"))
        const query = queryString.parse(search)
        const fromCurrency = query.i || "bitcoin_1"
        const toCurrencies = query.o || "bitcoin_100"
        if (fromCurrency) {
          dispatch({
            type: actionTypes.SELECT_FROM_CURRENCY,
            payload: fromCurrency.split("_")[0]
          })
          dispatch({
            type: actionTypes.SET_FROM_CURRENCY_AMOUNT,
            payload: parseFloat(fromCurrency.split("_")[1])
          })
        }
        if (toCurrencies) {
          const toSet = {}
          toCurrencies.split(",").forEach((pair, i) => {
            toSet[i] = {
              currency: pair.split("_")[0],
              weight: pair.split("_")[1]
            }
            dispatch({
              type: actionTypes.BATCH_SET_TO_CURRENCIES,
              payload: toSet
            })
          })
        }
        dispatch({
          type: actionTypes.SET_PAGE,
          payload: "morph"
        })
        dispatch({
          type: actionTypes.SET_TRADE_STAGE,
          payload: tradeStages.NOT_STARTED
        })
      }
    }
  }
)(MorphPage)
