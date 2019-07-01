import Loader from "~/components/common/Loader"

const withLoader = Component => ({ loaded, ...otherProps }) => {
  if (!loaded) {
    delete otherProps.children
    return (
      // <Component {...otherProps}>
      <Loader className={otherProps.className} />
      // </Component >
    )
  } else {
    return <Component {...otherProps} />
  }
}

export default withLoader
