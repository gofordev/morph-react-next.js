export const currencies = [
  "Dash",
  "BitcoinCash",
  "Bitcoin",
  "Litecoin",
  "Ethereum",
  "Monero"
]

export const currencyAbbrevs = {
  Bitcoin: "BTC",
  Ethereum: "ETH",
  Litecoin: "LTC",
  BitcoinCash: "BCH",
  Monero: "XMR",
  Dash: "DASH"
}

export const currencyAbbrevsReversed = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  LTC: "Litecoin",
  BCH: "BitcoinCash",
  XMR: "Monero",
  DASH: "Dash"
}

export const apiDomain =
  process.env.NODE_ENV === "development"
    ? "test-api.morphtoken.com"
    : "api.morphtoken.com"

export const decimalPlacesByAsset = {
  Monero: 12,
  Bitcoin: 8,
  Litecoin: 8,
  Ethereum: 18,
  Dash: 8,
  BitcoinCash: 8
}

export const purples = [
  "#3c2260",
  "#4d2367",
  "#5d256e",
  "#6d2575",
  "#7e257c",
  "#902684"
]

function TradeStage(o) {
  for (var key in o) {
    this[key] = o[key]
  }
}

function TradeStages(o) {
  for (var key in o) {
    this[key] = new TradeStage(o[key])
  }
}

TradeStage.prototype = {
  valueOf: function() {
    return this.index
  }
  // for easy comparison
}

TradeStages.prototype = {
  sortKeys: function() {
    return Object.keys(this).sort((a, b) => {
      return a.index > b.index ? -1 : 1
    })
  }
}

export const tradeStages = new TradeStages({
  NOT_STARTED: {
    index: 0,
    key: "NOT_STARTED",
    type: "major"
  },
  WAITING_FOR_DEPOSIT: {
    index: 1,
    key: "WAITING_FOR_DEPOSIT",
    type: "major"
  },
  WAITING_FOR_DEPOSIT_CONFIRMATION: {
    index: 2,
    key: "WAITING_FOR_DEPOSIT_CONFIRMATION",
    type: "minor"
  },
  PROCESSING: {
    index: 3,
    key: "PROCESSING",
    type: "minor"
  },
  TRADING: {
    index: 4,
    key: "TRADING",
    type: "minor"
  },
  TRADED: {
    index: 5,
    key: "TRADED",
    type: "minor"
  },
  COMPLETE_NO_TXID: {
    index: 6,
    key: "COMPLETE_NO_TXID",
    type: "minor"
  },
  COMPLETE_WITH_TXID: {
    index: 7,
    key: "COMPLETE_WITH_TXID",
    type: "major"
  },
  // error stages
  PROCESSING_REFUND: {
    index: 6,
    key: "PROCESSING_REFUND",
    type: "error"
  },
  COMPLETE_WITH_REFUND: {
    index: 7,
    key: "COMPLETE_WITH_REFUND",
    type: "error"
  },
  COMPLETE_WITHOUT_REFUND: {
    index: 7,
    key: "COMPLETE_WITHOUT_REFUND",
    type: "error"
  },
  CANCELED: {
    index: 7,
    key: "CANCELED",
    type: "error"
  },
  EXPIRED: {
    index: 7,
    key: "EXPIRED",
    type: "error"
  }
})

export const morphStateToTradeStage = {
  PENDING: tradeStages.WAITING_FOR_DEPOSIT,
  CONFIRMING: tradeStages.WAITING_FOR_DEPOSIT_CONFIRMATION,
  PROCESSING: tradeStages.PROCESSING,
  TRADING: tradeStages.TRADING,
  TRADED: tradeStages.TRADED,
  COMPLETE_NO_TXID: tradeStages.COMPLETE_NO_TXID,
  COMPLETE_WITH_TXID: tradeStages.COMPLETE_WITH_TXID,
  PROCESSING_REFUND: tradeStages.PROCESSING_REFUND,
  COMPLETE_WITH_REFUND: tradeStages.COMPLETE_WITH_REFUND,
  COMPLETE_WITHOUT_REFUND: tradeStages.COMPLETE_WITHOUT_REFUND,
  CANCELED: tradeStages.CANCELED,
  EXPIRED: tradeStages.EXPIRED
}
