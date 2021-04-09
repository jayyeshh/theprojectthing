import { connect } from "react-redux";
import { Redirect, Route } from "react-router";

const DeveloperOnlyRoute = ({
  isAuthenticated,
  as,
  component: Component,
  ...rest
}) => {
  console.log("rest: ", rest);
  return isAuthenticated && as === "Developer" ? (
    <Component {...rest} />
  ) : (
    <Route>
      <Redirect to="/" />
    </Route>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.authReducer.authenticated,
    as: state.authReducer.as,
  };
};

export default connect(mapStateToProps)(DeveloperOnlyRoute);
