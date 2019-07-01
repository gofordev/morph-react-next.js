import React, { useState } from "react"
import PropTypes from "prop-types"

import { isValidAddress } from "~/lib/crypto"
import "./index.css"

const AddressInput = props => {
  const placeholder = props.placeholder || `Enter ${props.type} address`

  const [valid, setValid] = useState(true)
  const onChange = e => {
    if (
      e.target.value &&
      !isValidAddress(props.currency.toLowerCase(), e.target.value)
    ) {
      setValid(false)
    } else {
      setValid(true)
    }
    props.onChange(e)
  }
  return (
    <input
      autoComplete={`${props.currency}-${props.type}-address`}
      className={"morph-input address-input " + (!valid ? "invalid" : "")}
      onChange={onChange}
      placeholder={placeholder}
      value={props.value}
    />
  )
}

AddressInput.propTypes = {
  currency: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string
}

export default AddressInput
