// Based off of https://github.com/rehooks/window-scroll-position.
import { useEffect, useState } from "react"
import throttle from "lodash.throttle"

// From https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
let supportsPassive = false
try {
  const opts = Object.defineProperty({}, "passive", {
    get: function() {
      supportsPassive = true
    }
  })
  window.addEventListener("testPassive", null, opts)
  window.removeEventListener("testPassive", null, opts)
} catch (e) {}

const defaultOptions = {
  throttle: 100
}

const getPosition = () => ({
  x: window.pageXOffset,
  y: window.pageYOffset
})

const useScrollPosition = options => {
  const opts = Object.assign({}, defaultOptions, options)
  const [position, setPosition] = useState(getPosition())

  useEffect(() => {
    const onScroll = throttle(() => {
      setPosition(getPosition())
    }, opts.throttle)

    window.addEventListener(
      "scroll",
      onScroll,
      supportsPassive ? { passive: true } : false
    )

    return () => {
      onScroll.cancel()
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return position
}

export default useScrollPosition
