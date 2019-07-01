require("dotenv").config()
const withCSS = require("@zeit/next-css")
const webpack = require("webpack")

module.exports = withCSS({
  webpack: config => {
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.API_HOST": JSON.stringify(
          process.env.API_HOST || "https://api.morphtoken.com"
        ),
        "process.env.SOCKJS_SERVER": JSON.stringify(
          process.env.SOCKJS_SERVER || "https://api.morphtoken.com/streaming"
        ),
        "process.env.TESTNET_ENABLED": JSON.stringify(
          +process.env.TESTNET_ENABLED || false
        ),
        "process.env.SENTRY_DSN": JSON.stringify(process.env.SENTRY_DSN || "")
      })
    )
    return config
  },

  exportPathMap: () => ({
    "/": { page: "/" },
    "/morph": { page: "/morph" },
    "/morph/view": { page: "/morph/view" },
    "/morph/lookup": { page: "/morph/lookup" },
    "/testing/force-trade-stage": {
      page: "/testing/force-trade-stage"
    },
    "/settings": { page: "/settings" },
    "/faq": { page: "/faq" },
    "/api": { page: "/api" }
    // "/affiliate": { page: "/affiliate" },
    // "/terms": { page: "/terms" }
  })
})
