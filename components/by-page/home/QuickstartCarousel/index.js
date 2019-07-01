import React from "react"
import Slider from "react-slick"

import EasyMarkdown from "~/components/common/EasyMarkdown"
import SVG from "~/components/common/SVG"
import { quickstart_guide as textContent } from "~/text/by-page/home"
import "./index.css"

// Avoid passing react-slick props to elements that don't support them.
// See https://github.com/akiran/react-slick/issues/728#issuecomment-310773471.
const CustomArrow = props => {
  // Remove props that shouldn't be passed to the <button> tag.
  const { currentSlide, slideCount, ...remainingProps } = props
  return (
    <button {...remainingProps}>
      <SVG src="/static/icons/ui/simple-arrow.svg" />
    </button>
  )
}

const QuickstartCarousel = props => {
  const settings = {
    arrows: true,
    dots: true,
    dotsClass: "slick-dots morph-carousel-dots",
    infinite: false,
    prevArrow: <CustomArrow />,
    nextArrow: <CustomArrow />,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  }
  return (
    <Slider {...settings} className="quickstart-carousel">
      {textContent.steps.map((stepObj, i) => (
        <div className="quickstart-step" key={"index as key ok here"[i]}>
          <div className="step-contents flex-container">
            <div className="thumbnail-container flex-1">
              <img src={`/static/other_images/quickstart.step_${i + 1}.png`} />
            </div>
            <ul className="lines flex-1">
              {stepObj.lines.map((lineObj, j) => (
                <li key={"qwertyuiopasdfghjkl"[j]} className="line">
                  <EasyMarkdown type="p" className="primary">
                    {lineObj.primary || ""}
                  </EasyMarkdown>
                  <EasyMarkdown type="p" className="secondary">
                    {lineObj.secondary || ""}
                  </EasyMarkdown>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </Slider>
  )
}

export default QuickstartCarousel
