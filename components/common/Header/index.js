import React from "react"
import Link from "next/link"

import LogoImage from "../MorphLogo/Image"
import LogoText from "../MorphLogo/Text"
import NavBar from "../NavBar"
import "./index.css"

const Header = props => {
  return (
    <header className={"header "}>
      <Link href="/">
        <a title="home">
          <div className="sticky-logo-wrapper">
            <div className={"logo-wrapper"}>
              <LogoImage size="small" />
              <LogoText />
            </div>
          </div>
        </a>
      </Link>
      <NavBar />
    </header>
  )
}

export default Header
