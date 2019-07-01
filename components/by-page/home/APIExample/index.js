import React from "react"

import "./index.css"

class APIExample extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: "httpie",
      showResult: false
    }
  }

  onCode = evt => {
    evt.preventDefault()
    this.setState({ active: evt.target.name })
  }

  toggleShow = evt => {
    evt.preventDefault()
    this.setState({ showResult: !this.state.showResult })
  }

  render() {
    return (
      <div className="api-example">
        {this.renderButton("httpie")}
        {this.renderButton("cURL")}
        {this.renderButton("Python")}
        {this.renderCode()}
      </div>
    )
  }

  renderCode() {
    const showResult = this.state.showResult

    return (
      <div className="example-code">
        <pre>
          {this.state.active === "httpie"
            ? `http https://api.morphtoken.com/morph \\
    input:='{
      "asset": "ETH",
      "refund": "0x4d2022abbda11a510ee109ea8a1446ed5fd8210d"
    }' \\
    output:='[{
      "asset": "BTC",
      "weight": 10000,
      "address": "3CuWxAYh8niCuhMfb5fXN5NjasiY54E8cc"
    }]'`
            : this.state.active === "cURL"
            ? `curl https://api.morphtoken.com/morph \\
    -X POST -H "Content-Type: application/json" \\
    -d '{
      "input": {
        "asset": "ETH",
        "refund": "0x4d2022abbda11a510ee109ea8a1446ed5fd8210d"
      },
      "output": [{
        "asset": "BTC",
        "weight": 10000,
        "address": "3CuWxAYh8niCuhMfb5fXN5NjasiY54E8cc"
      }]
    }'`
            : `import json
  try:
      from urllib2 import Request, urlopen
  except ImportError:
      # Python 3
      from urllib.request import Request, urlopen
  req = Request(
          'https://api.morphtoken.com/morph',
          json.dumps({
              'input': {
                  'asset': 'ETH',
                  'refund': '0x4d2022abbda11a510ee109ea8a1446ed5fd8210d'
              },
              'output': [{
                  'asset': 'BTC',
                  'weight': 10000,
                  'address': '3CuWxAYh8niCuhMfb5fXN5NjasiY54E8cc'
              }]
          }).encode('utf8'),
          {'Content-Type': 'application/json'}
  )
  resp = urlopen(req)
  result = json.loads(resp.read().decode('utf8'))
  print(result)
  resp.close()`}
        </pre>
        <div>
          <button className="view-result" href="#" onClick={this.toggleShow}>
            {showResult ? "Hide result" : "View result"}
          </button>
        </div>

        {showResult && (
          <pre className="result">
            {`{
    "created_at": "2017-11-26T11:32:44.718697+00:00",
    "id": "2MGK3GXP2JN",
    "state": "PENDING",
    "input": {
      "asset": "ETH",
      "received": null,
      "confirmed_at_height": null,
      "deposit_address": "0x82817105e9bd380f81f4492644100c90ee8ee523",
      "legacy_deposit_address": null,
      "refund_address": "0x4d2022abbda11a510ee109ea8a1446ed5fd8210d",
      "limits": {
        "max": 106665000000000000000,
        "min": 20000000000000000
      }
    },
    "output": [
      {
        "asset": "BTC",
        "weight": 10000,
        "address": "3CuWxAYh8niCuhMfb5fXN5NjasiY54E8cc",
        "seen_rate": "0.05115837",
        "final_rate": null,
        "network_fee": {
          "flat": true,
          "fee": 60000
        },
        "converted_amount": null,
        "txid": null
      }
    ],
    "refund": null,
    "remaining_weight": 0
  }`}
          </pre>
        )}
      </div>
    )
  }

  renderButton(name) {
    return (
      <a
        className={"code-tab " + (this.state.active === name ? "active" : "")}
        href="#"
        name={name}
        onClick={this.onCode}
      >
        {name}
      </a>
    )
  }
}

export default APIExample
