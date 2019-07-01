import React, { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"

import HorizontalLine from "../HorizontalLine"
import LogoAndName from "../LogoAndName"
import SVG from "../SVG"
import DropdownArrow from "../icons/DropdownArrow"
import { currencies } from "~/lib/constants"
import "./index.css"

let persistentHovered
// the other one wasn't behaving properly in a closure

const CurrencyDropdown = props => {
  // remove event listeners when the widget is locked
  const ifNotLocked = fn => {
    if (props.locked) {
      return null
    }
    return fn
  }

  const buttonRef = useRef(null)
  const inputRef = useRef(null)

  // input value
  const [value, setValue] = useState(props.currency)
  const onChange = e => {
    setValue(e.target.value)
  }
  // ...if we got a new currency from redux,
  // replace value with that.
  useEffect(() => {
    setValue(props.currency)
  }, [props.currency])

  // hover state
  const [hovered, setHovered] = useState(false)
  persistentHovered = hovered
  const onMouseOver = () => {
    if (!props.locked) {
      setHovered(true)
    }
  }
  const onMouseOut = () => setHovered(false)

  // open state
  const [open, setOpen] = useState(false)
  const closeOnFocusOut = e => {
    if (e.target !== buttonRef.current) {
      closeIt()
    } else {
      e.stopPropagation()
    }
  }
  function closeIt() {
    if (!persistentHovered) {
      // so that button bg doesn't awkwardly disappear
      // b4 dropdown bg
      setHovered(true)
      setTimeout(() => setHovered(false), 525)
    }
    setOpen(false)
    if (inputRef.current && !currencies.includes(inputRef.current.value)) {
      setValue(props.currency)
    }
    window.removeEventListener("click", closeOnFocusOut)
  }
  function openIt() {
    if (props.locked) {
      return
    }
    setOpen(true)
    setValue("")
    window.addEventListener("click", closeOnFocusOut)
  }

  const clickHandler = ifNotLocked(e => {
    e.stopPropagation()
    if (!open) {
      openIt()
    }
  })

  const autoHighlight = ifNotLocked(e => e.target.select())
  const dropdownVisibleClass = open ? "dropdown" : "dropdown squashed"

  // focus state
  const [focusedIndex, setFocusedIndex] = useState(-1)

  // arrow navigation
  const numCurrencies = currencies.length
  const keyDownListener = e => {
    // e.preventDefault()
    if (e.key === "ArrowUp") {
      setFocusedIndex((numCurrencies + (focusedIndex - 1)) % numCurrencies)
    } else if (e.key === "ArrowDown") {
      setFocusedIndex((focusedIndex + 1) % numCurrencies)
    } else if (e.key === "Enter") {
      props.onSelectCurrency(sortedCurrencyObjs[focusedIndex].currency)
      closeIt()
    }
  }

  // sort by matching, then alphabetically
  const match = c => c.toLowerCase().includes(value.toLowerCase())
  const currencyObjs = currencies.map(c => ({ currency: c, match: match(c) }))
  const sortedCurrencyObjs = currencyObjs.sort((c1, c2) => {
    if (c1.match && !c2.match) {
      return -1
    } else if (c2.match && !c1.match) {
      return 1
    } else {
      return c1 >= c2 ? -1 : 1
    }
  })

  return (
    <div
      className={`currency-dropdown
            ${open ? "open" : ""}`}
      onKeyDown={open ? keyDownListener : null}
    >
      <button
        className={`arrow-icon-name flex-container
                ${hovered || open ? props.hoverClass : ""}`}
        onClick={clickHandler}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        ref={buttonRef}
      >
        <DropdownArrow
          direction={hovered || open ? "down" : "right"}
          type="dot"
        />
        <div className="flex-container logo-and-name">
          <SVG
            src={`/static/icons/currencies/${props.currency}.svg`}
            className="currency-logo flex-0-1 icon"
          />
          <input
            className="flex-0-1"
            readOnly={props.locked}
            maxLength="11"
            onChange={onChange}
            onClick={autoHighlight}
            placeholder={props.currency}
            ref={inputRef}
            value={value}
          />
          <h4 className="locked-currency">{value}</h4>
        </div>
      </button>
      <div
        className={`${dropdownVisibleClass} ${props.dropdownClassName || ""}`}
      >
        {" "}
        <HorizontalLine />
        <ul>
          {sortedCurrencyObjs.map((currencyObj, i) => {
            const onMouseOver = () => setFocusedIndex(i)
            const onSelect = () => {
              props.onSelectCurrency(currencyObj.currency)
              setOpen(false)
              setValue(currencyObj.currency)
            }
            return (
              <button
                className={
                  (focusedIndex === i ? "focused" : "") +
                  " " +
                  (currencyObj.match ? "" : "non-matching")
                }
                key={currencyObj.currency}
                onClick={onSelect}
                onMouseOver={onMouseOver}
              >
                <LogoAndName currency={currencyObj.currency} />
              </button>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

CurrencyDropdown.propTypes = {
  hoverClass: PropTypes.string,
  dropdownClassName: PropTypes.string,
  currency: PropTypes.string.isRequired,
  locked: PropTypes.bool,
  onSelectCurrency: PropTypes.func
}

export default CurrencyDropdown
