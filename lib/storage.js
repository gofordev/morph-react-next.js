import storage from "store"

// setters
export const appendToStoredRecentTrades = (id, created_at) => {
  const MAX_MEM = 50
  const storedIds = getStoredRecentTrades()
  if (storedIds.length === MAX_MEM) {
    storedIds.shift()
  }
  storedIds.push({
    id,
    created_at
  })
  storage.set("recentTrades", storedIds)
}

export const clearStoredRecentTrades = () => {
  storage.set("recentTrades", [])
}

export const storeTag = tag => {
  storage.set("tag", tag)
}

export const storeQuotes = quotes => {
  storage.set("quotes", quotes)
}

export const storeMorph = morph => {
  storage.set("morph", morph)
}

export const storeAddress = (type, address, extra) => {
  const current = storage.get("setting:address") || {}
  const now = new Date()
  current[type] = { address: address, timestamp: +now }
  if (extra) {
    current[type].extra = extra
  }
  storage.set("setting:address", current)
}

// getters
export const getStoredTag = () => {
  return storage.get("tag")
}

export const getStoredQuotes = () => {
  return storage.get("quotes")
}

export const getStoredMorph = () => {
  return storage.get("morph") || {}
}

export const getStoredAddress = currency => {
  const storedAddresses = getStoredAddresses()
  if (storedAddresses && storedAddresses[currency.toLowerCase()]) {
    return storedAddresses[currency.toLowerCase()].address
  }
  return null
}

export const getStoredAddresses = () => {
  return storage.get("setting:address") || {}
}

export const getStoredRecentTrades = () => {
  return storage.get("recentTrades") || []
}
