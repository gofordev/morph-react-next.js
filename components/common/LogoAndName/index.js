import React, { useState } from "react"
import PropTypes from "prop-types"

import SVG from "../SVG"
import "./index.css"

const propTypes = {
  className: PropTypes.string,
  currency: PropTypes.string.isRequired
}

const LogoAndName = props => {
  return (
    <div
      className={`flex-container logo-and-name
            ${props.className || ""}`}
    >
      <SVG
        src={`/static/icons/currencies/${props.currency}.svg`}
        className="currency-logo flex-0-1 icon"
      />
      <h4 className="flex-0-1">{props.currency}</h4>
    </div>
  )
}

LogoAndName.propTypes = propTypes

export default LogoAndName
