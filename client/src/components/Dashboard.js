import React from "react";
import { Grid, Hidden } from "@material-ui/core";
import { connect } from "react-redux";
import Profile from "./Profile";
import { makeStyles } from "@material-ui/core/styles";
import { setModalStateAction } from "../actions/modalActions";
import Home from "./Home";

const useStyles = makeStyles((theme) => ({
  dashboardContainer: {
    maxWidth: "90%",
    overflow: "none",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
    },
  },
  profileContainer: {
    margin: "2rem 0",
    position: "fixed",
    right: "2%",
    [theme.breakpoints.down("md")]: {
      right: "4%",
    },
    [theme.breakpoints.down("sm")]: {
      right: "10%",
    },
  },
  homePageContainer: {
    overflowY: "auto",
    overflowX: "hidden",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignContent: "center",
      margin: 0,
      padding: 0,
    },
  },
}));

const Dashboard = (props) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.dashboardContainer}>
      <Grid
        item
        sm={9}
        xs={12}
        container
        align="center"
        className={classes.homePageContainer}
      >
        <Home setModalState={props.setModalState} authedAs={props.authedAs} />
      </Grid>
      <Hidden xsDown>
        <Grid className={classes.profileContainer} item xs={3}>
          <Profile authedAs={props.authedAs} />
        </Grid>
      </Hidden>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    authedAs: state.authReducer.as,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setModalState: (modalState, text) =>
      dispatch(setModalStateAction({ showModal: modalState, text })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
