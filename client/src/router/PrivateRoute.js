import { connect } from "react-redux";
import { Redirect, Route } from "react-router";

const PrivateRoute = ({ isAuthenticated, component: Component, ...rest }) => {
  return isAuthenticated ? (
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
  };
};

export default connect(mapStateToProps)(PrivateRoute);
