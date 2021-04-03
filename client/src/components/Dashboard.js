import React from "react";
import Header from "./Header";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import CompanyHomePage from "./CompanyHomePage";
import DeveloperHomePage from "./DeveloperHomePage";
import Profile from "./Profile";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  profileContainer: {
    margin: "2rem 0",
    padding: "1rem",
  },
});

const Dashboard = (props) => {
  const classes = useStyles();
  return (
    <Grid
      style={{
        width: "100vw",
        height: "92vh",
        overflow: "hidden",
      }}
      container
      spacing={4}
    >
      <Grid item xs={9}></Grid>
      <Grid className={classes.profileContainer} item xs={3}>
        <Profile authedAs={props.authedAs} />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    authedAs: state.authReducer.as,
  };
};

export default connect(mapStateToProps)(Dashboard);
