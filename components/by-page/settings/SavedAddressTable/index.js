import React from "react"

import AddressInput from "~/components/common/AddressInput"
import LogoAndName from "~/components/common/LogoAndName"
import { currencies, purples } from "~/lib/constants"
import { isValidAddress } from "~/lib/crypto"
import { storeAddress } from "~/lib/storage"
import "./index.css"

const SavedAddressTable = props => {
  // onchange:
  // if it passes validation, then store it locally
  // the end
  return (
    <div className="saved-address-table">
      <div className="row header">
        <p className="currency">asset</p>
        <p className="address">deposit address</p>
      </div>
      {currencies.map((currency, i) => {
        const onChange = e => {
          const normCurrency = currency.toLowerCase()
          if (isValidAddress(normCurrency, e.target.value)) {
            storeAddress(normCurrency, e.target.value)
          }
        }
        return (
          <div style={{ backgroundColor: purples[i] }} className="row" key={i}>
            <div className="cell currency">
              <LogoAndName currency={currency} />
            </div>
            <div className="cell address">
              <AddressInput
                currency={currency}
                onChange={onChange}
                type="deposit"
                placeholder={`Your ${currency} address`}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SavedAddressTable
