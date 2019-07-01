import React from "react"

import EasyMarkdown from "~/components/common/EasyMarkdown"
import Page from "~/components/common/Page"
import text_content from "~/text/by-page/api"
import "./index.css"

const APIPage = () => (
  <Page className="api-page" title={text_content.title}>
    <div className="documentation-body">
      <div className="intro-block">
        <h2 className="intro-title">{text_content.introduction.heading}</h2>
        <EasyMarkdown type="p" className="intro-summary">
          {text_content.introduction.summary}
        </EasyMarkdown>
        <p>Base URL for the HTTP API: https://api.morphtoken.com</p>
        <p>Websocket (with SockJS) URL: https://api.morphtoken.com/streaming</p>
        <EasyMarkdown type="p" className="intro-note">
          {text_content.introduction.note}
        </EasyMarkdown>
        {text_content.routes.map((routeObj, i) => (
          <EasyMarkdown type="code" key={i}>
            {routeObj.example_request}
          </EasyMarkdown>
        ))}
      </div>
    </div>
  </Page>
)

export default APIPage
