import React from "react"
import Link from "next/link"

import LogoImage from "../MorphLogo/Image"
import LogoText from "../MorphLogo/Text"
import "./index.css"

const linksLeft = [
  {
    text: "Home",
    href: "/"
  },
  {
    text: "New Trade",
    href: "/morph"
  },
  {
    text: "Settings",
    href: "/settings"
  },
  {
    text: "FAQ",
    href: "/faq"
  },
  {
    text: "Trade Look Up",
    href: "/morph/lookup"
  },
  {
    text: "API",
    href: "/api"
  }
]

const linksRight = [
  {
    className: "nohover",
    text: "Follow us"
  },
  {
    // this is a placeholder to force a blank
    className: "spacemaker",
    text: "space-1"
  },
  {
    text: "Twitter",
    href: "https://twitter.com/morphtoken"
  },
  {
    text: "Telegram",
    href: "https://t.me/morphtoken"
  },
  {
    text: "Medium Blog",
    href: "https://medium.com/@MorphToken"
  },
  {
    text: "Service Status",
    href: "http://status.morphtoken.com"
  }
]

const Logo = () => (
  <React.Fragment>
    <Link href="/">
      <a>
        <LogoImage />
      </a>
    </Link>
    <Link href="/">
      <a>
        <LogoText />
      </a>
    </Link>
  </React.Fragment>
)

const Footer = props => (
  <footer className={"footer " + (props.className || "")}>
    <div className="swoosh" />
    <div className="content with-padding">
      <div className="logo-container small-sizes">
        <Logo />
      </div>
      <div className="flex-container columns-container">
        <ul className="flex-0-1 upper left column">
          {linksLeft.map(o => (
            <li key={o.text}>
              <Link href={o.href}>
                <a>{o.text}</a>
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex-0-1 middle column">
          <Logo />
        </div>
        <ul className="flex-0-1 upper right column">
          {linksRight.map(o => {
            const linkProps = { className: o.className, href: o.href }
            return (
              <li key={o.text}>
                <a {...linkProps}>{o.text}</a>
              </li>
            )
          })}
        </ul>
      </div>
      <p className="copyright">
        ©MorphToken 2017 - {new Date().getFullYear()} All rights
        reserved.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;::&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="#" target="_blank">
          Terms & Conditions
        </a>
      </p>
    </div>
  </footer>
)

export default Footer
