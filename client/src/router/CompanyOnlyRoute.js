import { connect } from "react-redux";
import { Redirect, Route } from "react-router";

const CompanyOnlyRoute = ({
  isAuthenticated,
  as,
  component: Component,
  ...rest
}) => {
  return isAuthenticated && as === "Company" ? (
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

export default connect(mapStateToProps)(CompanyOnlyRoute);
