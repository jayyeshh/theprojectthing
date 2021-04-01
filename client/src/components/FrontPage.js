import React from "react";
import Header from "./Header";
import { Grid } from "@material-ui/core";
import { useHistory } from "react-router";
import { connect } from "react-redux";

const FrontPage = (props) => {
  const history = useHistory();
  if (props.isAuthenticated) history.push("/dashboard");
  return (
    <Grid container direction="column">
      <Grid item>
        <Header />
      </Grid>
      <Grid item container>
        FrontPage
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.authReducer.authenticated,
  };
};

export default connect(mapStateToProps)(FrontPage);
