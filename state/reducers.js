import shortid from "shortid"

import {
  currencies,
  currencyAbbrevsReversed,
  morphStateToTradeStage,
  tradeStages
} from "~/lib/constants"
import { getStoredMorph, getStoredAddress } from "~/lib/storage"
import * as utils from "~/lib/utils"
import actionTypes from "./actionTypes"

// read pieces of initial state from localstorage
const storedCurrencies = getStoredMorph()
const initialFromCurrency = storedCurrencies.fromCurrency || {
  amount: 1,
  currency: "BitcoinCash",
  receivingAddress: ""
}

const initialToCurrencies = storedCurrencies.toCurrencies || {
  [shortid.generate()]: {
    currency: utils.choice(currencies),
    receivingAddress: "",
    weight: 5000
  },
  [shortid.generate()]: {
    currency: utils.choice(currencies),
    receivingAddress: "",
    weight: 5000
  }
}

// whole initial state
const initialState = {
  fromCurrency: initialFromCurrency,
  lookupLoading: false,
  lookupNotFound: false,
  lookupQuery: null,
  lookupResults: [],
  lookupType: "local",
  page: null,
  tickerResponse: {
    data: {}
  },
  toCurrencies: initialToCurrencies,
  tradeInFlight: false,
  tradeMeta: {},
  tradeStage: tradeStages.NOT_STARTED.key,
  tradeWidgetLocked: false,
  tradeWidgetHeight: null
}

const equalizeCurrencies = (currencyObj, total = 100) => {
  const currencyCount = Object.keys(currencyObj).length
  let remainder = total
  Object.keys(currencyObj).forEach((id, i) => {
    const thisWeight = Math.floor(total / currencyCount)
    currencyObj[id].weight = thisWeight * 100
    remainder -= thisWeight
    currencyObj[id].weight +=
      i === Object.keys(currencyObj).length - 1 ? remainder * 100 : 0
  })
}

export const fromCurrency = (prevState = initialState.fromCurrency, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_FROM_CURRENCY_AMOUNT: {
      return {
        ...prevState,
        amount: parseFloat(
          (parseFloat(prevState.amount) + parseFloat(action.payload)).toFixed(5)
        )
      }
    }
    case actionTypes.LOAD_TRADE_RESPONSE: {
      const readFrom = action.payload.input
      return {
        ...prevState,
        currency: currencyAbbrevsReversed[readFrom.asset],
        address: readFrom.refund_address,
        amount: parseFloat(readFrom.received || prevState.amount)
      }
    }
    case actionTypes.SELECT_FROM_CURRENCY: {
      return {
        ...prevState,
        currency: action.payload
      }
    }
    case actionTypes.SET_FROM_CURRENCY_AMOUNT: {
      return {
        ...prevState,
        amount: action.payload
      }
    }
    case actionTypes.LOAD_TRADE_RESPONSE: {
      return {
        ...prevState,
        currency: currencyAbbrevsReversed[action.payload.input.asset],
        address: action.payload.input.refund_address
      }
    }
    case actionTypes.SET_FROM_CURRENCY_RECEIVING_ADDRESS: {
      return {
        ...prevState,
        address: action.payload
      }
    }
    default: {
      return prevState
    }
  }
}

export const lookupLoading = (
  prevState = initialState.lookupLoading,
  action
) => {
  switch (action.type) {
    case actionTypes.INIT_LOOKUP: {
      return true
    }
    case actionTypes.SET_LOOKUP_RESULTS: {
      return false
    }
    default: {
      return prevState
    }
  }
}

export const lookupNotFound = (
  prevState = initialState.lookupLoading,
  action
) => {
  switch (action.type) {
    case actionTypes.SET_LOOKUP_NOT_FOUND: {
      return action.payload
    }
    default: {
      return prevState
    }
  }
}

export const lookupQuery = (prevState = initialState.lookupQuery, action) => {
  switch (action.type) {
    case actionTypes.INIT_LOOKUP: {
      return action.payload
    }
    default: {
      return prevState
    }
  }
}

export const lookupResults = (
  prevState = initialState.lookupResults,
  action
) => {
  switch (action.type) {
    case actionTypes.SET_LOOKUP_RESULTS: {
      return action.payload
    }
    default: {
      return prevState
    }
  }
}

export const lookupType = (prevState = initialState.lookupType, action) => {
  switch (action.type) {
    case actionTypes.SET_LOOKUP_TYPE: {
      return action.payload
    }
    default: {
      return prevState
    }
  }
}

export const page = (prevState = initialState.page, action) => {
  switch (action.type) {
    case actionTypes.SET_PAGE: {
      return action.payload
    }
    default: {
      return prevState
    }
  }
}

export const tickerResponse = (
  prevState = initialState.tickerResponse,
  action
) => {
  switch (action.type) {
    case actionTypes.UPDATE_RATES_DATA: {
      // vvv because sometimes not all currencies are present in this response
      return {
        timestamp: action.payload.timestamp,
        data: {
          ...prevState.data,
          ...action.payload.data
        }
      }
    }
    default: {
      return prevState
    }
  }
}

export const toCurrencies = (prevState = initialState.toCurrencies, action) => {
  switch (action.type) {
    case actionTypes.ADD_SPLIT_CURRENCY: {
      const newState = { ...prevState }
      // add random new currency
      const existingCurrencies = Object.keys(prevState).map(
        id => prevState[id].currency
      )
      const unused = currencies.filter(
        currency => !existingCurrencies.includes(currency)
      )
      const currency = utils.choice(unused) || utils.choice(currencies)
      newState[shortid.generate()] = {
        address: getStoredAddress(currency) || "",
        currency: currency,
        weight: 100 / Object.keys(newState).length + 1
      }

      // make all currencies the same evenly distributed weight
      equalizeCurrencies(newState)

      return newState
    }
    case actionTypes.BATCH_SET_ADDRESSES: {
      const newState = { ...prevState }
      const addressObj = action.payload
      for (let id in newState) {
        const currency = newState[id].currency.toLowerCase()
        if (addressObj[currency]) {
          newState[id].address = addressObj[currency].address
        }
      }
      return newState
    }
    case actionTypes.BATCH_SET_TO_CURRENCIES: {
      return action.payload
    }
    case actionTypes.CHANGE_TO_CURRENCY_WEIGHT: {
      const newState = {
        ...prevState
      }

      // adjust target currency
      const targetCurrency = newState[action.payload.id]
      const newWeight = Math.round(
        parseInt(targetCurrency.weight) + parseFloat(action.payload.changeBy)
      )
      targetCurrency.weight = newWeight

      // adjust all the other currencies
      delete newState[action.payload.id]
      equalizeCurrencies(newState, 100 - newWeight)

      // add back target currency
      newState[action.payload.id] = targetCurrency
      return newState
    }
    case actionTypes.LOAD_TRADE_RESPONSE: {
      const newState = {}
      action.payload.output.forEach((o, i) => {
        newState[shortid.generate()] = {
          ...o,
          currency: currencyAbbrevsReversed[o.asset]
        }
      })
      return newState
    }
    case actionTypes.REMOVE_TO_CURRENCY: {
      const newState = { ...prevState }
      delete newState[action.payload]
      equalizeCurrencies(newState)
      return newState
    }
    case actionTypes.SELECT_TO_CURRENCY: {
      const newState = { ...prevState }
      newState[action.payload.id].currency = action.payload.currency
      newState[action.payload.id].address =
        getStoredAddress(action.payload.currency) || ""
      return newState
    }
    case actionTypes.SET_TO_CURRENCY_RECEIVING_ADDRESS: {
      const newState = { ...prevState }
      newState[action.payload.id].address = action.payload.address
      return newState
    }
    case actionTypes.SET_TO_CURRENCY_WEIGHT: {
      const newState = { ...prevState }

      // // adjust target currency
      const targetCurrency = newState[action.payload.id]
      const newWeight = parseFloat(action.payload.value) || 0
      targetCurrency.weight = newWeight

      // adjust all the other currencies
      delete newState[action.payload.id]
      equalizeCurrencies(newState, 100 - newWeight)

      // add back target currency
      newState[action.payload.id] = targetCurrency
      return newState
    }
    default: {
      return prevState
    }
  }
}

export const tradeInFlight = (
  prevState = initialState.tradeInFlight,
  action
) => {
  switch (action.type) {
    case actionTypes.REQUEST_INIT_TRADE: {
      return true
    }
    case actionTypes.CONFIRM_INIT_TRADE: {
      return false
    }
    default: {
      return prevState
    }
  }
}

export const tradeMeta = (prevState = initialState.tradeMeta, action) => {
  switch (action.type) {
    case actionTypes.LOAD_TRADE_RESPONSE: {
      const inputObj = action.payload.input
      return {
        created_at: action.payload.created_at,
        deposit_address: inputObj.deposit_address,
        id: action.payload.id,
        state: action.payload.state,
        received: inputObj.received,
        maxDeposit: inputObj.limits.max,
        minDeposit: inputObj.limits.min
      }
    }
    default: {
      return prevState
    }
  }
}

export const tradeStage = (prevState = initialState.tradeStage, action) => {
  switch (action.type) {
    case actionTypes.SET_TRADE_STAGE: {
      return action.payload.key
    }
    case actionTypes.LOAD_TRADE_RESPONSE: {
      return morphStateToTradeStage[action.payload.state].key
    }
    default: {
      return prevState
    }
  }
}

export const tradeWidgetHeight = (
  prevState = initialState.tradeWidgetHeight,
  action
) => {
  switch (action.type) {
    case actionTypes.SET_TRADE_WIDGET_HEIGHT: {
      return action.payload
    }
    default: {
      return prevState
    }
  }
}

export const tradeWidgetLocked = (
  prevState = initialState.tradeWidgetLocked,
  action
) => {
  switch (action.type) {
    case actionTypes.LOAD_TRADE_RESPONSE: {
      return morphStateToTradeStage[action.payload.state] > 0
    }
    case actionTypes.LOCK_TRADE_WIDGET: {
      return true
    }
    case actionTypes.UNLOCK_TRADE_WIDGET: {
      return false
    }
    default: {
      return prevState
    }
  }
}
