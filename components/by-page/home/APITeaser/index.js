import React from "react"
import Link from "next/link"

import APIExample from "../APIExample"
import { api_teaser as textContent } from "~/text/by-page/home"
import "./index.css"

const APITeaser = props => (
  <div className={"api-teaser with-padding " + (props.className || "")}>
    <div className="title-container">
      <h2 className="upper">{textContent.title}</h2>
      <h3>{textContent.subtitle}</h3>
    </div>
    <div className="api-preview-container">
      <APIExample />
      <p className="caption">
        Visit the{" "}
        <Link href="/api">
          <a className="inline-link" target="_blank">
            API Page
          </a>
        </Link>{" "}
        for more information.
      </p>
    </div>
  </div>
)

export default APITeaser
