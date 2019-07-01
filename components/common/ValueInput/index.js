import React, { useRef, useState } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import * as utils from "~/lib/utils"
import actionTypes from "~/state/actionTypes"
import "./index.css"

const autoHighlight = e => e.target.select()

const applyBounds = (changeValue, props) => {
  const newValue = props.amount + changeValue
  if (utils.truthyOrZero(props.upperBound) && newValue > props.upperBound) {
    changeValue = utils.bound(
      changeValue,
      null,
      props.upperBound - props.amount
    )
  }
  if (utils.truthyOrZero(props.lowerBound) && newValue < props.lowerBound) {
    changeValue = utils.bound(
      changeValue,
      props.lowerBound - props.amount,
      null
    )
  }
  return changeValue
}

const propTypes = {
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  direction: PropTypes.string.isRequired,
  id: PropTypes.any,
  lowerBound: function(props, propName, componentName) {
    if (props[propName] && props[propName] > props.upperBound) {
      throw new Error(`Property ${propName} on component \
            ${componentName} must be less than or equal to that
            component's upperBound`)
    }
  },
  units: PropTypes.string.isRequired,
  upperBound: function(props, propName, componentName) {
    if (props[propName] && props[propName] < props.lowerBound) {
      throw new Error(`Property ${propName} on component \
            ${componentName} must be greater than or equal to that
            component's lowerBound`)
    }
  }
}

const ValueInput = props => {
  // refs
  const inputRef = useRef(null)
  const transferFocus = () => {
    if (inputRef) {
      inputRef.current.focus()
    }
  }

  // state
  const [focused, setFocused] = useState(false)
  const onFocus = () => setFocused(true)
  const onBlur = () => setFocused(false)

  return (
    <div
      className={`value-input morph-input flex-container
                ${props.className || ""}
                ${focused ? " focused" : ""}`}
      onClick={transferFocus}
    >
      <input
        style={{ width: props.width }}
        className="value"
        disabled={props.editable === undefined ? false : !props.editable}
        maxLength="7"
        onBlur={onBlur}
        onClick={autoHighlight}
        onFocus={onFocus}
        onKeyDown={props.onKeyDown}
        ref={inputRef}
        value={
          props.direction === "to"
            ? parseInt(props.amount) / 100 || 0
            : props.amount
        }
        onChange={e => e.preventDefault()}
      />
      <span className="flex-0-1 units">{props.units}</span>
    </div>
  )
}

ValueInput.propTypes = propTypes

export default connect(
  null,
  (dispatch, ownProps) => {
    let setAction, changeAction
    if (ownProps.direction === "from") {
      setAction = actionTypes.SET_FROM_CURRENCY_AMOUNT
      changeAction = actionTypes.CHANGE_FROM_CURRENCY_AMOUNT
    } else if (ownProps.direction === "to") {
      setAction = actionTypes.SET_TO_CURRENCY_WEIGHT
      changeAction = actionTypes.CHANGE_TO_CURRENCY_WEIGHT
    }

    return {
      adjustValue: (valence, event) => {
        let factor = 1
        if (event && event.altKey) {
          factor = 0.1
        }
        if (event && event.shiftKey) {
          factor = 10
        }
        let changeBy = parseInt(valence) * factor
        changeBy = applyBounds(changeBy, ownProps)
        dispatch({
          type: changeAction,
          payload:
            ownProps.direction === "to"
              ? {
                  id: ownProps.id,
                  changeBy: changeBy
                }
              : changeBy
        })
      },
      setValue: newValue => {
        if (newValue !== "") {
          // allow empty string so they can delete all the way
          newValue = utils.bound(
            newValue,
            ownProps.lowerBound,
            ownProps.upperBound
          )
        }
        dispatch({
          type: setAction,
          payload:
            ownProps.direction === "to"
              ? {
                  id: ownProps.id,
                  value: newValue
                }
              : newValue
        })
      }
    }
  },
  (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    onClick: e => {
      dispatchProps.adjustValue(parseInt(e.currentTarget.value), e)
    },
    onKeyDown: e => {
      // ARROW KEYS
      if (e.key === "ArrowDown") {
        return dispatchProps.adjustValue(-1, event)
      }
      if (e.key === "ArrowUp") {
        return dispatchProps.adjustValue(1, event)
      }

      // OTHER NUMERICAL INPUT

      // validate entry
      if (!"1234567890.".includes(e.key) && e.key !== "Backspace") {
        return
      }
      if (e.key === "." && e.target.value.includes(".")) {
        return
      }
      let firstHalf = e.target.value.substr(0, e.target.selectionStart)
      const secondHalf = e.target.value.substr(
        e.target.selectionEnd,
        e.target.value.length
      )
      let newValue

      // handle deletion
      if (e.key === "Backspace") {
        if (e.target.selectionStart === e.target.selectionEnd) {
          firstHalf = firstHalf.substr(0, firstHalf.length - 1)
        }
        newValue = firstHalf + secondHalf
        if (e.metaKey) {
          newValue = ""
        }
      } else {
        newValue = firstHalf + e.key + secondHalf
      }
      dispatchProps.setValue(newValue)
    }
  })
)(ValueInput)
