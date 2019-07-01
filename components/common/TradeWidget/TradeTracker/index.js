import React from "react"
import { connect } from "react-redux"

import { tradeStages } from "~/lib/constants"
import { trade_widget as textContent } from "~/text/by-page/morph"
import "./index.css"

const TradeTracker = props => {
  window.tradeStages = tradeStages
  const kebobContents = []
  const minorCount = Object.keys(tradeStages).filter(
    k => tradeStages[k].type === "minor"
  ).length
  const stageKeys = tradeStages.sortKeys()
  let lastStage
  stageKeys.forEach((key, i) => {
    const stage = tradeStages[key]
    let statusClass = ""
    // if we've passed a stage, it is fulfilled
    if (i <= tradeStages[props.tradeStage]) {
      statusClass += "fulfilled"
    }
    // if we've attained a stage, it is fulfilled,
    // but if it's an error, we represent it as such
    if (
      i == tradeStages[props.tradeStage] &&
      tradeStages[props.tradeStage].type === "error"
    ) {
      statusClass += " error"
    }
    // if we've passed that stage, it gets filled in
    if (stage.type === "major") {
      // major stages get a circle and a long bar
      if (lastStage === "major") {
        kebobContents.push(
          <div
            style={{ flex: minorCount }}
            className={`${statusClass} bar major rounded-left rounded-right`}
            key={stage + "bar major"}
          />
        )
      }
      kebobContents.push(
        <div className={`${statusClass} circle`} key={stage + "circle"} />
      )
    }
    if (stage.type === "minor") {
      // minor stages just get a short bar
      let roundedClass = lastStage === "major" ? "rounded-left" : ""
      if (
        tradeStages[stageKeys[i]] &&
        tradeStages[stageKeys[i]].type === "major"
      ) {
        roundedClass += " rounded-right"
      }
      kebobContents.push(
        <div
          className={`${statusClass} bar minor ${roundedClass}`}
          key={stage + "bar minor"}
        />
      )
    }
    if (stage.type === "error") {
    }
    lastStage = stage.type
  })
  return (
    <div className={`${props.className || ""} trade-tracker`}>
      <p>{textContent.tracker_stages[props.tradeStage]}</p>
      <div className="kebob">{kebobContents}</div>
    </div>
  )
}

TradeTracker.propTypes = {}

export default connect(({ tradeStage }) => ({ tradeStage }))(TradeTracker)
