import { decimalPlacesByAsset } from "./constants"

export const bound = (num, min, max) => {
  let result = num
  if (truthyOrZero(min)) {
    result = Math.max(num, min)
  }
  if (truthyOrZero(max)) {
    result = Math.min(num, max)
  }
  if (parseFloat(num) === parseFloat(result)) {
    return num
  }
  return result
}

export const choice = arr => {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const debounce = (fn, delay) => {
  let timeout
  const debounced = (...args) => {
    // every time it's invoked, it cancels the timeout.
    // so only the last call will run.
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      fn(...args)
    }, delay)
  }
  return debounced
}

export const formatAmount = (rawAmount, asset) => {
  const digits = decimalPlacesByAsset[asset]
  let amount
  try {
    amount = Intl.NumberFormat("en-US", {
      maximumFractionDigits: digits,
      useGrouping: false
    }).format(rawAmount / 10 ** digits)
  } catch (err) {
    // Fallback for environments without Intl.NumberFormat.
    amount = (rawAmount / 10 ** digits).toFixed(digits)
    if (amount.indexOf(".") > 0) {
      // Drop leading zeros.
      amount = amount.replace(/0+$/, "")
      if (amount[amount.length - 1] === ".") {
        // Drop period.
        amount = amount.slice(0, -1)
      }
    }
  }
  return amount
}

export const htmlWhitespace = count =>
  Array(count)
    .fill(null)
    .map(() => "&nbsp;")
    .join("")

export const idToQueryString = (id, amount) => {
  return `?q=${id}&` + (amount && `amount=${amount}`)
}

export const stringifyNumber = num => {
  // add commas
  const asString = num.toString(10)
  let [beforeDecimal, afterDecimal] = asString.split(".")
  let withCommas = ""
  for (let i = 0; i < beforeDecimal.length; i++) {
    withCommas += beforeDecimal.charAt(beforeDecimal.length - (i + 1))
    if ((i + 1) % 3 === 0 && i < beforeDecimal.length - 1) {
      withCommas += ","
    }
  }
  if (afterDecimal) {
    afterDecimal = "." + afterDecimal
  } else {
    afterDecimal = ""
  }
  return (
    withCommas
      .split("")
      .reverse()
      .join("") + afterDecimal
  )
}

export const stringToFloat = s => {
  if (s.charAt(s.length - 1) === ".") {
    s += "0"
  }
  return parseFloat(s.replace(/,/g, ""))
}

export const truthyOrZero = val => val === 0 || !!val
