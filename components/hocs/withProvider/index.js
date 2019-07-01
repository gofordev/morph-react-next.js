import { Provider } from "react-redux"

import store from "~/state/store"

export default Component => props => (
  <Provider store={store}>
    <Component {...props} />
  </Provider>
)
