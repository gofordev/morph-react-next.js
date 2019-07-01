import React from "react"
import { connect } from "react-redux"

import HorizontalLine from "../HorizontalLine"
import SVG from "../SVG"
import { purples } from "~/lib/constants"
import actionTypes from "~/state/actionTypes"
import "./index.css"

const SplitAdder = props => {
  return (
    <div
      className={`split-adder ${props.className || ""}`}
      style={{
        backgroundColor: purples[Object.keys(props.toCurrencies).length]
      }}
    >
      <button onClick={props.onClick}>
        <HorizontalLine />
        <div className="btn-group flex-container flex-align-center">
          <p className="flex-0-1 add-split">Add split</p>
          <SVG className="flex-0-1" src="/static/icons/ui/cross.svg" />
        </div>
      </button>
    </div>
  )
}

export default connect(
  ({ toCurrencies }) => ({ toCurrencies }),
  dispatch => {
    return {
      onClick: () => {
        dispatch({
          type: actionTypes.ADD_SPLIT_CURRENCY
        })
      }
    }
  }
)(SplitAdder)
