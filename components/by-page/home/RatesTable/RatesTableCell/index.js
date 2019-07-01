import React, { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"

import "./index.css"

const RatesTableCell = props => {
  const valueRef = useRef()
  const [changeDirection, setChangeDirection] = useState(null)

  useEffect(() => {
    if (props.value > valueRef.current) {
      setChangeDirection("up")
    } else if (props.value < valueRef.current) {
      setChangeDirection("down")
    } else {
      setChangeDirection(null)
    }
    setTimeout(() => setChangeDirection(null), 2000)
    valueRef.current = props.value
  }, [props.value])

  let className = "bg-center rates-table-cell inline-block"
  if (changeDirection) {
    className += " animating " + changeDirection
  }
  return <td className={className}>{props.value}</td>
}

RatesTableCell.propTypes = {
  value: PropTypes.number
}

export default RatesTableCell
