import React from "react"

import NewTradeButton from "~/components/common/NewTradeButton"
import OutreachText from "~/components/common/OutreachText"
import Page from "~/components/common/Page"
import FAQBox from "../FAQBox"
import text_content from "~/text/by-page/faq"
import "./index.css"

const FAQPage = () => (
  <Page
    className="fag-page"
    title={text_content.title}
    subtitle={text_content.subtitle}
  >
    <div className="bg-cover inner-swoosh-bg with-padding">
      {text_content.question_blocks.map((questionObj, i) => (
        <FAQBox {...questionObj} key={i} />
      ))}
      <OutreachText>
        <NewTradeButton />
      </OutreachText>
    </div>
  </Page>
)

export default FAQPage
