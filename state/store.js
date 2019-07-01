import { createStore, combineReducers } from "redux"

import { debounce } from "~/lib/utils"
import { storeMorph } from "~/lib/storage"
import * as reducers from "./reducers"

// middleware
const promiseMiddleware = store => next => action => {
  if (typeof action.then !== "function") {
    return next(action)
  }
  return Promise.resolve(action).then(store.dispatch)
}

const store = createStore(
  combineReducers(reducers),
  typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : noop => noop
)

// on change, persist parts of store to local storage,
// debouncing for performance
store.subscribe(
  debounce(() => {
    const state = store.getState()
    storeMorph({
      fromCurrency: state.fromCurrency,
      toCurrencies: state.toCurrencies
    })
  }, 1500)
)

export default store
