import React from "react"

import HorizontalLine from "../../HorizontalLine"
import SVG from "../../SVG"
import "./index.css"

const ErrorReadout = props => {
  let currencyBar = null
  if (props.refund) {
    currencyBar = (
      <div className={"to-currency currency-bar "}>
        <div className="currency-bar-padding">
          <div className="above-line flex-container">
            <div className="flex-container logo-and-name">
              <SVG
                src={`/static/icons/currencies/${"Bitcoin"}.svg`}
                className="currency-logo flex-0-1 icon"
              />
              <input className="flex-0-1" readOnly={true} maxLength="11" />
              <h4 className="locked-currency">Bitcoin</h4>
            </div>
            <div className="locked-trade-value-group relative flex-0-1">
              <p className="trade-value">{999}</p>
              <p className="value-caption">BTC</p>
            </div>
          </div>
          <HorizontalLine className="currency-bar-divider" />
          <div className="below-line">
            <div className="flex-container below-line-data">
              <div className="exchange-value-group flex-0-1">
                <div className="flex-container flex-align-center flex-0-1">
                  <p className="flex-0-1 exchange-value">{98743}</p>
                  <p className="flex-0-1 exchange-value-units">BTC</p>
                </div>
                <p className="exchange-value-tag">refunded amount</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return <div className="error-readout">{currencyBar}</div>
}

export default ErrorReadout
