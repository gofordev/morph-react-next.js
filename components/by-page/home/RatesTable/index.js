import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import withLoader from "~/components/hocs/withLoader"
import RatesTableHeader from "./RatesTableHeader"
import RatesTableRow from "./RatesTableRow"
import RatesTableLabels from "./RatesTableLabels"
import { currencyAbbrevs } from "~/lib/constants"
import * as textContent from "~/text/by-page/home.json"
import "./index.css"

const RatesTable = props => (
  <div className="rates-table-container tuck-up with-padding">
    <div className="rates-table-title-container">
      <h3>{textContent.rates_table.subtitle}</h3>
      <h2>{textContent.rates_table.title}</h2>
    </div>
    <div className="relative table-wrapper">
      <RatesTableLabels labels={Object.values(currencyAbbrevs)} />
      <table className="rates-table">
        <RatesTableHeader fields={Object.keys(currencyAbbrevs)} />
        <tbody className="rates-table-data">
          {Object.values(currencyAbbrevs).map(abbrev => (
            <RatesTableRow
              data={props.ratesData[abbrev]}
              fields={Object.values(currencyAbbrevs)}
              key={abbrev}
              label={abbrev}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

RatesTable.propTypes = {
  swooshDimensions: PropTypes.object
}

export default connect(({ swooshDimensions }) => ({ swooshDimensions }))(
  withLoader(RatesTable)
)
