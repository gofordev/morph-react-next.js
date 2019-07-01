import Router from "next/router"

import { fetchTrade, postTrade } from "~/lib/api-service"
import { currencyAbbrevs } from "~/lib/constants"
import { appendToStoredRecentTrades } from "~/lib/storage"
import { idToQueryString } from "~/lib/utils"
import actionTypes from "./actionTypes"

export const handleTradeResponse = (payload, dispatch) => {
  if (payload.state === "COMPLETE") {
    if (payload.output.every(output => output.txid)) {
      payload.state = "COMPLETE_WITH_TXID"
    } else {
      payload.state = "COMPLETE_NO_TXID"
    }
  }
  dispatch({
    type: actionTypes.LOAD_TRADE_RESPONSE,
    payload
  })
}

export const initTrade = (fromCurrency, toCurrencies, dispatch) => {
  const tradeObject = {
    input: {
      asset: currencyAbbrevs[fromCurrency.currency],
      refund: fromCurrency.address
    },
    output: Object.keys(toCurrencies).map(id => {
      const toC = toCurrencies[id]
      return {
        asset: currencyAbbrevs[toC.currency],
        weight: toC.weight,
        address: toC.address
      }
    })
  }
  dispatch({
    type: actionTypes.REQUEST_INIT_TRADE
  })
  postTrade(tradeObject).then(resp => {
    appendToStoredRecentTrades(resp.id, resp.created_at)
    Router.push("/morph/view" + idToQueryString(resp.id, fromCurrency.amount))
    dispatch({
      type: actionTypes.CONFIRM_INIT_TRADE
    })
    fetchTrade(resp.id).then(payload => handleTradeResponse(payload, dispatch))
  })
}

export const handleTickerResponse = (response, dispatch) => {
  const abbrevsPresent = Object.keys(response.data)
  const allAbbrevs = Object.values(currencyAbbrevs)
  if (JSON.stringify(abbrevsPresent) === JSON.stringify(allAbbrevs)) {
    if (handleTickerResponse.first) {
      throw new Error("missing some currencies in initial ticker response")
    }
  }
  dispatch({
    type: actionTypes.UPDATE_RATES_DATA,
    payload: response
  })
}
