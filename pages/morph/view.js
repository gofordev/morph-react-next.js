import { withRouter } from "next/router"

import MorphViewPage from "~/components/by-page/morph/view/MorphViewPage"
import withProvider from "~/components/hocs/withProvider"
import "~/global.css"

export default withRouter(withProvider(MorphViewPage))
