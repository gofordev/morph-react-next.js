import { withRouter } from "next/router"

import MorphPage from "~/components/by-page/morph/MorphPage"
import withProvider from "~/components/hocs/withProvider"
import "~/global.css"

export default withRouter(withProvider(MorphPage))
