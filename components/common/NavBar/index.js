import React from "react"
import Link from "next/link"

import "./index.css"

const NavBar = props => (
  <div className="nav-bar">
    <Link href="/faq">
      <a className="faq">FAQ</a>
    </Link>
    <span className="middot">•</span>
    <Link href="/settings">
      <a>Settings</a>
    </Link>
    <span className="middot">•</span>
    <Link href="/api">
      <a>API</a>
    </Link>
  </div>
)

export default NavBar
