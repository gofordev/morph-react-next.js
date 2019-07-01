import React from "react"
import { connect } from "react-redux"
import queryString from "query-string"

import MorphContents from "../../MorphContents"
import { fetchTrade } from "~/lib/api-service"
import { createEmitter, messageTypes } from "~/lib/socket-service"
import { handleTradeResponse } from "~/state/actionCreators"
import actionTypes from "~/state/actionTypes"
import "./index.css"

const MorphViewPage = props => {
  const widgetReady = !!Object.keys(props.tradeMeta).length
  return (
    <MorphContents
      onMount={[props.fetchTradeData, props.setSubscriptions]}
      widgetReady={widgetReady}
    />
  )
}

MorphViewPage.propTypes = {}

export default connect(
  ({ tradeMeta }) => ({ tradeMeta }),
  (dispatch, ownProps) => {
    const url = ownProps.router.asPath
    const search = url.substring(url.indexOf("?"))
    const query = queryString.parse(search)
    return {
      fetchTradeData: () => {
        fetchTrade(query.q).then(payload =>
          handleTradeResponse(payload, dispatch)
        )
      },
      setSubscriptions: () => {
        const fromCurrencyAmount = query.amount || 1
        dispatch({
          type: actionTypes.SET_FROM_CURRENCY_AMOUNT,
          payload: fromCurrencyAmount
        })
        dispatch({
          type: actionTypes.SET_PAGE,
          payload: "morph"
        })
        const emitter = createEmitter(query.q)
        const unsubTrade = emitter.subscribe(
          messageTypes.TRADE_UPDATE,
          payload => handleTradeResponse(payload, dispatch)
          // need to do some preprocessing on the payload before dispatching
        )
        return unsubTrade
      }
    }
  }
)(MorphViewPage)
