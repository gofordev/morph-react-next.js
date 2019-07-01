import React from "react"

import Page from "~/components/common/Page"
import LookupTable from "../LookupTable"
import * as textContent from "~/text/by-page/morph/lookup"
import "./index.css"

const MorphLookupPage = () => (
  <Page
    className="morph-lookup-page"
    title={textContent.title}
    subtitle={textContent.subtitle}
  >
    <div className="bg-cover inner-swoosh-bg with-padding">
      <LookupTable />
    </div>
  </Page>
)

export default MorphLookupPage
