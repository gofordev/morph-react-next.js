import React, { useEffect, useState } from "react"
import request from "superagent"

import Loader from "~/components/common/Loader"
import { morphStateToTradeStage } from "~/lib/constants"
import "./index.css"

const TestingPage = () => {
  const apiHost = process.env.API_HOST
  const updateTradesFromResponse = resp => {
    const ids = {}
    for (let key in resp.body) {
      const trade = resp.body[key]
      ids[trade.id] = trade
    }
    setLoaded(true)
    setAllTrades(ids)
  }
  useEffect(() => {
    request.get(apiHost + "/trades").then(updateTradesFromResponse)
  }, [])

  const [trade, setTrade] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [allTrades, setAllTrades] = useState([])
  const [morphState, setMorphState] = useState(null)
  const [amount, setAmount] = useState(null)
  if (loaded) {
    return (
      <form
        className="force-trade-page page"
        onSubmit={e => {
          e.preventDefault()
          setLoaded(false)
          window.form = e.target
          if (morphState === "CONFIRMING" && !amount) {
            throw new Error(
              "you must set an amount if youre setting state to confirming"
            )
          }
          request
            .post(apiHost + "/forceTradeUpdate")
            .send({
              id: e.target["morph-id"].value,
              state: e.target["morph-state"].value,
              amount: e.target["deposit-amount"].value
            })
            .then(updateTradesFromResponse)
        }}
      >
        <h1>Welcome to the</h1>
        <h1>FORCE TRADE PAGE</h1>
        <p>
          Pick a trade from the dropdown. Choose the state that trade will move
          into. If you would like to move into the "CONFIRMING" page, that means
          you have supposedly made a deposit, so you must choose an mount.
        </p>
        <label htmlFor="morph-id">morph-id</label>
        <select
          autoComplete={true}
          onChange={e => {
            setMorphState(allTrades[e.target.value].state)
            setTrade(e.target.value)
          }}
          name="morph-id"
        >
          {Object.keys(allTrades).map(key => (
            <option selected={trade === allTrades[key].id} value={key}>
              {key}
            </option>
          ))}
        </select>
        <label htmlFor="morph-state">morph-state</label>
        <select
          autoComplete={true}
          onChange={e => setMorphState(e.target.value)}
          name="morph-state"
        >
          {Object.keys(morphStateToTradeStage).map(state => (
            <option selected={morphState === { state }} value={state}>
              {state}
            </option>
          ))}
        </select>
        <label htmlFor="deposit-amount">deposit-amount</label>
        <input
          name="deposit-amount"
          onChange={e => setAmount(e.target.value)}
          disabled={morphState !== "CONFIRMING"}
          readonly
          type="number"
          value={amount}
        />
        <input type="submit" value="SUBMIT!" />
      </form>
    )
  } else {
    return <Loader />
  }
}

export default TestingPage
