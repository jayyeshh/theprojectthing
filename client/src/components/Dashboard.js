import React from "react";
import Header from "./Header";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import CompanyHomePage from "./CompanyHomePage";
import DeveloperHomePage from "./DeveloperHomePage";

const Dashboard = (props) => {
  return (
    <Grid container>
      <Header />
      {props.authedAs === "Company" && <CompanyHomePage />}
      {props.authedAs === "Developer" && <DeveloperHomePage />}
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    authedAs: state.authReducer.as,
  };
};

export default connect(mapStateToProps)(Dashboard);
