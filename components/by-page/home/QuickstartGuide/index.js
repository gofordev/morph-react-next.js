import React from "react"

import EasyMarkdown from "~/components/common/EasyMarkdown"
import QuickstartCarousel from "../QuickstartCarousel"
import { quickstart_guide as textContent } from "~/text/by-page/home"
import "./index.css"

const QuickstartGuide = props => (
  <div className="bg-center quickstart-guide tuck-up">
    <h2 className="with-padding upper">{textContent.title}</h2>
    <QuickstartCarousel />
    <EasyMarkdown type="p" className="with-padding quickstart-caption">
      {textContent.caption}
    </EasyMarkdown>
  </div>
)

export default QuickstartGuide
