import Link from "next/link"
import React, { useEffect, useState } from "react"
import moment from "moment"
import request from "superagent"
import { connect } from "react-redux"

import CalloutButton from "~/components/common/CalloutButton"
import EasyMarkdown from "~/components/common/EasyMarkdown"
import HorizontalLine from "~/components/common/HorizontalLine"
import Loader from "~/components/common/Loader"
import DropdownArrow from "~/components/common/icons/DropdownArrow"
import { clearStoredRecentTrades, getStoredRecentTrades } from "~/lib/storage"
import { idToQueryString } from "~/lib/utils"
import actionTypes from "~/state/actionTypes"
import * as textContent from "~/text/by-page/morph/lookup"
import "./index.css"

const LookupTable = props => {
  useEffect(props.getLocalRecents, [])
  const [inputValue, setInputValue] = useState("")
  const onChange = e => setInputValue(e.target.value)

  const clearButtonOnCLick = () => {
    clearStoredRecentTrades()
    props.getLocalRecents()
  }

  const formatTime = s => moment(s).format("MM/DD/YYYY :: h:mma")

  const tableTitle =
    props.lookupType === "local"
      ? textContent.table_title
      : `Results for query "${props.lookupQuery}"`

  const localResultsPresent =
    props.lookupType === "local" && props.lookupResults.length
  const noLocalResults =
    props.lookupType === "local" && !props.lookupResults.length
  return (
    <div className="lookup-table">
      <div className="lookup-table-header lookup-table-padding">
        <div className="title-container">
          <EasyMarkdown type="h2" className="title">
            {textContent.title}
          </EasyMarkdown>
          <EasyMarkdown type="h3" className="subtitle">
            {textContent.subtitle}
          </EasyMarkdown>
        </div>
        <form
          className="search-container flex-container"
          onSubmit={props.handleSubmit}
        >
          <input
            className="morph-input search-input"
            name="morphInput"
            placeholder="Morph ID or Deposit Address"
            onChange={onChange}
            value={inputValue}
          />
          <CalloutButton
            className="primary-action search-button"
            disabled={!inputValue}
            title="search"
          />
        </form>
      </div>
      <div className="lookup-table-body">
        <div className={"search-results-header lookup-table-padding "}>
          <EasyMarkdown type="h3" className="table-title">
            {tableTitle}
          </EasyMarkdown>
          <HorizontalLine />
          <div className="row fields flex-container">
            <EasyMarkdown type="p" className="cell flex-0-1">
              {textContent.table_fields[0]}
            </EasyMarkdown>
            <EasyMarkdown type="p" className="cell flex-0-1">
              {textContent.table_fields[1]}
            </EasyMarkdown>
            <DropdownArrow className="cell flex-0-1 transparent" />
          </div>
        </div>
        <Loader className={props.lookupLoading || "hidden"} />
        <div className={"results " + (props.lookupLoading && "hidden")}>
          {props.lookupResults.map(tradeObj => (
            <Link href={"/morph/view" + idToQueryString(tradeObj.id)}>
              <div className="row flex-container">
                <div className="morph-id-wrapper cell flex-1">
                  <p className="morph-id ">{tradeObj.id}</p>
                </div>
                <p className="created-at cell flex-0-1">
                  {formatTime(tradeObj.created_at)}
                </p>
                <DropdownArrow className="cell flex-0-1" direction="right" />
              </div>
            </Link>
          ))}
          <div
            className={
              "row no-local-trades-bar " + (noLocalResults || "hidden")
            }
          >
            <EasyMarkdown className="cell" type="p">
              {textContent.no_local_trades_message}
            </EasyMarkdown>
          </div>
          <div
            className={
              "row not-found-bar " + (props.lookupNotFound || "hidden")
            }
          >
            <EasyMarkdown className="cell" type="p">
              {textContent.not_found_message}
            </EasyMarkdown>
          </div>
        </div>
      </div>
      <div className="lookup-table-footer lookup-table-padding">
        <EasyMarkdown
          type="p"
          className={"note " + (localResultsPresent || "hidden")}
        >
          {textContent.table_footer.note}
        </EasyMarkdown>
        <div className="buttons">
          <CalloutButton
            className={localResultsPresent || "hidden"}
            disabled={!props.lookupResults.length}
            onClick={clearButtonOnCLick}
            title={textContent.table_footer.clear_button}
          />
          <CalloutButton
            className={props.lookupType !== "local" || "hidden"}
            title={textContent.table_footer.recent_trades_button}
            onClick={props.getLocalRecents}
          />
        </div>
      </div>
    </div>
  )
}

export default connect(
  ({
    lookupLoading,
    lookupNotFound,
    lookupQuery,
    lookupResults,
    lookupType
  }) => ({
    lookupLoading,
    lookupNotFound,
    lookupQuery,
    lookupResults,
    lookupType
  }),
  dispatch => ({
    handleSubmit: e => {
      e.preventDefault()
      const query = e.target.elements.morphInput.value
      if (!query) {
        return
      }

      dispatch({
        type: actionTypes.INIT_LOOKUP,
        payload: query
      })
      dispatch({
        type: actionTypes.SET_LOOKUP_TYPE,
        payload: "remote"
      })
      request.get(`${process.env.API_HOST}/morph/${query}`).then(resp => {
        let notFound = false,
          results = [resp.body]
        if (resp.body.code === 1100 || !resp.body) {
          results = []
          notFound = true
        }
        dispatch({
          type: actionTypes.SET_LOOKUP_RESULTS,
          payload: results
        })
        dispatch({
          type: actionTypes.SET_LOOKUP_NOT_FOUND,
          payload: notFound
        })
      })
    },
    getLocalRecents: () => {
      const recents = getStoredRecentTrades()
      dispatch({
        type: actionTypes.SET_LOOKUP_RESULTS,
        payload: recents
      })
      dispatch({
        type: actionTypes.SET_LOOKUP_NOT_FOUND,
        payload: false
      })
      dispatch({
        type: actionTypes.SET_LOOKUP_TYPE,
        payload: "local"
      })
    }
  })
)(LookupTable)
