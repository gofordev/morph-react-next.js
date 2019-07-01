import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import Footer from "~/components/common/Footer"
import Header from "~/components/common/Header"
import TitleBar from "~/components/common/TitleBar"

const TopSection = ({ title, subtitle, footnote, titleBar }) => (
  <section className="bg-center bg-cover top-section with-padding">
    <Header />
    {titleBar ? (
      titleBar
    ) : (
      <TitleBar title={title} subtitle={subtitle} footnote={footnote} />
    )}
  </section>
)

const Page = ({ children, ...props }) => (
  <article className={classNames("page", props.className)}>
    <TopSection
      title={props.title}
      subtitle={props.subtitle}
      footnote={props.footnote}
      titleBar={props.titleBar}
    />
    <section className="page-content">{children}</section>
    <Footer />
  </article>
)

Page.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
}

export default Page
