import React from "react"
import PropTypes from "prop-types"
import Markdown from "markdown-to-jsx"

// wrapper around markdown-to-jsx for easier syntax.
// see prop types for usage
const EasyMarkdown = ({ children, type, ...props }) => {
  children = children || ""
  if (!type) {
    throw new Error("EasyMarkdown needs a `type` prop in order to render.")
  }
  const El = ({ children, type, ...props }) =>
    React.createElement(type, props, children)
  const overrides = props.options ? props.options.overrides : {}
  return (
    <Markdown
      className={props.className}
      type={type}
      options={{
        overrides: {
          span: {
            props,
            component: El
          },
          a: {
            props: { className: "inline-link" }
          },
          ...overrides
        }
      }}
    >
      {children}
    </Markdown>
  )
}

EasyMarkdown.propTypes = {
  type: PropTypes.string.isRequired
  // equivalent to the `type` param of React.createElement
}

export default EasyMarkdown
