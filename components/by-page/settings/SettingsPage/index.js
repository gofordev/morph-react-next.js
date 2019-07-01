import React from "react"

import NewTradeButton from "~/components/common/NewTradeButton"
import OutreachText from "~/components/common/OutreachText"
import Page from "~/components/common/Page"
import SavedAddressTable from "../SavedAddressTable"
import textContent from "~/text/by-page/settings"
import "./index.css"

const SettingsPage = () => (
  <Page
    className="settings-page"
    title={textContent.title}
    subtitle={textContent.subtitle}
    footnote={textContent.footnote}
  >
    <div className="bg-cover inner-swoosh-bg with-padding">
      <SavedAddressTable />
      <OutreachText>
        <NewTradeButton className="primary-action" />
      </OutreachText>
    </div>
  </Page>
)

export default SettingsPage
