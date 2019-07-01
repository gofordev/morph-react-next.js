import React, { useEffect } from "react"
import { connect } from "react-redux"

import APITeaser from "~/components/by-page/home/APITeaser"
import QuickstartGuide from "~/components/by-page/home/QuickstartGuide"
import RatesTable from "~/components/by-page/home/RatesTable"
import TitleBarHome from "~/components/by-page/home/TitleBar"
import OutreachText from "~/components/common/OutreachText"
import Page from "~/components/common/Page"
import TradeWidget from "~/components/common/TradeWidget"
import { handleTickerResponse } from "~/state/actionCreators"
import actionTypes from "~/state/actionTypes"
import { createEmitter, messageTypes } from "~/lib/socket-service"
import * as textContent from "~/text/by-page/home"
import "./index.css"

const HomePage = props => {
  // this is socket subscription to the ticker
  useEffect(() => {
    const tickerEmitter = createEmitter()
    const unsubscriber = tickerEmitter.subscribe(
      messageTypes.TICKER_UPDATE,
      props.onTick
    )
    return unsubscriber
  }, [])

  // set page to "home" in store
  useEffect(props.setPage)

  const dataLoaded = Object.keys(props.ratesData).length
  return (
    <Page
      className="home-page"
      titleBar={
        <TitleBarHome
          title_left={textContent.title_left}
          title_right={textContent.title_right}
          subtitle_left={textContent.subtitle_left}
          subtitle_right={textContent.subtitle_right}
        />
      }
    >
      <div
        className={`trade-widget-container with-padding trade-widget-outer bg-cover`}
      >
        <TradeWidget loaded={dataLoaded} />
      </div>
      <OutreachText className="with-padding" />
      {dataLoaded ? (
        <RatesTable
          ratesData={props.ratesData}
          loaded={Object.keys(props.ratesData).length}
        />
      ) : null}
      <QuickstartGuide />
      <div className="api-footer-wrapper bg-center">
        <APITeaser className="with-padding" />
      </div>
    </Page>
  )
}

export default connect(
  state => {
    return {
      ratesData: state.tickerResponse.data
    }
  },
  dispatch => {
    return {
      onTick: response => handleTickerResponse(response, dispatch),
      setPage: () => {
        dispatch({
          type: actionTypes.SET_PAGE,
          payload: "home"
        })
      }
    }
  }
)(HomePage)
