import React from "react"

import "./index.css"

const FeesTable = props => (
  <div className="fees-table-container">
    <table className="fees-table">
      <tbody>
        <tr>
          <td className="fees-table-row-label">Bitcoin</td>
          <td>0.0007</td>
        </tr>
        <tr>
          <td className="fees-table-row-label">Ethereum</td>
          <td>0.0025</td>
        </tr>
        <tr>
          <td className="fees-table-row-label">BitcoinCash</td>
          <td>0.0001</td>
        </tr>
        <tr>
          <td className="fees-table-row-label">Litecoin</td>
          <td>0.002</td>
        </tr>
        <tr>
          <td className="fees-table-row-label">Dash</td>
          <td>0.0002</td>
        </tr>
        <tr>
          <td className="fees-table-row-label">Monero</td>
          <td>0.00008</td>
        </tr>
      </tbody>
    </table>
  </div>
)

export default FeesTable
