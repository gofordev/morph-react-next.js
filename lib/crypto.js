const bech32 = require("bech32")
const bs58check = require("bs58check")
const createKeccakHash = require("keccak")
const cashaddr = require("cashaddrjs")
const TESTNET_ENABLED = process.env.TESTNET_ENABLED

// Source: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md
const toChecksumAddress = addressCheck => {
  const address = addressCheck.toLowerCase().replace("0x", "")
  const hash = createKeccakHash("keccak256")
    .update(address)
    .digest("hex")
  let ret = "0x"

  for (let i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}

const isEthereumAddress = address => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // Check if it has the basic requirements of an address
    return false
  } else if (
    /^(0x)?[0-9a-f]{40}$/.test(address) ||
    /^(0x)?[0-9A-F]{40}$/.test(address)
  ) {
    // If it's all small caps or all all caps, return true
    return true
  } else {
    return toChecksumAddress(address) === address
  }
}

const isMoneroAddress = address => {
  if (
    /^4[0-9a-zA-Z]{94}$/.test(address) ||
    /^8[0-9a-zA-Z]{94}$/.test(address)
  ) {
    // Regular address
    return true
  } else if (/^4[0-9a-zA-Z]{105}$/.test(address)) {
    // Integrated address
    return true
  } else if (TESTNET_ENABLED) {
    if (
      /^9[0-9a-zA-Z]{94}$/.test(address) ||
      /^B[0-9a-zA-Z]{94}$/.test(address) ||
      /^A[0-9a-zA-Z]{105}$/.test(address)
    ) {
      return true
    }
  }

  return false
}

const BECH32_PREFIX = {
  bitcoin: ["bc", "tb"],
  litecoin: ["ltc", "tltc"]
}

const isBech32 = (address, network) => {
  const valid = BECH32_PREFIX[network]
  if (!valid) {
    // Network not recognized.
    return false
  }

  try {
    const prefix = bech32.decode(address).prefix
    if (prefix === valid[0] || (TESTNET_ENABLED && prefix === valid[1])) {
      return true
    }
  } catch (err) {
    return false
  }
}

const isBitcoinLikeAddress = (address, valid) => {
  try {
    const first = bs58check.decode(address)[0]
    return valid.indexOf(first) >= 0
  } catch (err) {
    return false
  }
}

const isBitcoinAddress = address => {
  let valid = [0x00, 0x05]
  if (TESTNET_ENABLED) {
    valid = valid.concat([0x6f, 0xc4])
  }
  const accepted = isBitcoinLikeAddress(address, valid)
  if (accepted) {
    return true
  }

  return isBech32(address, "bitcoin")
}

const isLitecoinAddress = address => {
  let valid = [0x30, 0x05, 0x32]
  if (TESTNET_ENABLED) {
    valid = valid.concat([0x6f, 0xc4, 0x3a])
  }
  const accepted = isBitcoinLikeAddress(address, valid)
  if (accepted) {
    return true
  }

  return isBech32(address, "litecoin")
}

const isDashAddress = address => {
  let valid = [0x4c, 0x10]
  if (TESTNET_ENABLED) {
    valid = valid.concat([0x8b, 0x8c, 0x13])
  }
  return isBitcoinLikeAddress(address, valid)
}

const isBCashAddress = address => {
  const accepted = isBitcoinAddress(address)
  if (accepted) {
    return true
  }

  try {
    if (address.indexOf(":") === -1) {
      // No prefix, try prepending one.
      if (TESTNET_ENABLED) {
        cashaddr.decode("bchtest:" + address)
      }
      cashaddr.decode("bitcoincash:" + address)
    } else {
      cashaddr.decode(address)
    }
    return true
  } catch (err) {
    return false
  }
}

module.exports.isValidAddress = (asset, address) => {
  return VALIDATE[asset](address)
}

const VALIDATE = {
  bitcoin: isBitcoinAddress,
  litecoin: isLitecoinAddress,
  monero: isMoneroAddress,
  ethereum: isEthereumAddress,
  dash: isDashAddress,
  bitcoincash: isBCashAddress
}

// Assets
module.exports.AssetOrder = [
  "bitcoin",
  "ethereum",
  "bitcoincash",
  "litecoin",
  "dash",
  "monero"
]

module.exports.Asset = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  litecoin: "Litecoin",
  monero: "Monero",
  bitcoincash: "BitcoinCash",
  dash: "Dash"
}

module.exports.AssetSymbol = {
  bitcoin: "BTC",
  ethereum: "ETH",
  litecoin: "LTC",
  monero: "XMR",
  bitcoincash: "BCH",
  dash: "DASH"
}
