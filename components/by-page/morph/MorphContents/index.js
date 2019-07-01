import React, { useEffect } from "react"
import { connect } from "react-redux"

import NewTradeButton from "~/components/common/NewTradeButton"
import OutreachText from "~/components/common/OutreachText"
import Page from "~/components/common/Page"
import TradeWidget from "~/components/common/TradeWidget"
import textContent from "~/text/by-page/morph"
import "./index.css"

const MorphPage = props => {
  let cbs = props.onMount
  if (!cbs instanceof Array) {
    cbs = [cbs]
  }
  // breaking a hooks rule but we don't care what order they're executed in.
  cbs.forEach(cb => {
    useEffect(cb, [])
  })

  return (
    <Page
      className="morph-page"
      title={textContent.title}
      subtitle={textContent.subtitle}
    >
      <div className="bg-cover inner-swoosh-bg with-padding">
        <div className={`trade-widget-container trade-widget-outer bg-cover`}>
          <TradeWidget loaded={props.widgetReady} />
        </div>
        <OutreachText>
          <NewTradeButton />
        </OutreachText>
      </div>
    </Page>
  )
}

MorphPage.propTypes = {}

export default connect((state, tradeMeta) => {
  return {
    ratesData: state.tickerResponse.data,
    tradeMeta
  }
})(MorphPage)
