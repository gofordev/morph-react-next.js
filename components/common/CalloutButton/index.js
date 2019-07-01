import React from "react"
import PropTypes from "prop-types"

import SVG from "../SVG"
import "./index.css"

const CalloutButton = props => {
  let buttonTitle = props.title
  let buttonClass = `callout-button upper ${props.className || ""} `
  let buttonSubtitle = props.subtitle
  if (props.loading) {
    buttonClass += "in-progress "
    buttonTitle = <SVG src="/static/gifs/animated-morph-logo.gif" />
    buttonSubtitle = null
  }

  return (
    <button
      onClick={props.onClick}
      className={buttonClass}
      disabled={props.disabled}
    >
      <h4 className="button-title">{buttonTitle}</h4>
      <p className="button-subtitle">{buttonSubtitle}</p>
    </button>
  )
}

CalloutButton.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string
}

export default CalloutButton
