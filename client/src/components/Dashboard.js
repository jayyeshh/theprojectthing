import React from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import Profile from "./Profile";
import { makeStyles } from "@material-ui/core/styles";
import { setModalStateAction } from "../actions/modalActions";
import Home from "./Home";

const useStyles = makeStyles({
  profileContainer: {
    margin: "2rem 0",
    position: "fixed",
    right: "2%",
  },
});

const Dashboard = (props) => {
  const classes = useStyles();
  return (
    <Grid
      style={{
        width: "100vw",
        overflow: "hidden",
      }}
      container
      spacing={5}
    >
      <Grid
        style={{
          overflowY: "auto",
          overflowX: "hidden",
        }}
        item
        xs={9}
      >
        <Home setModalState={props.setModalState} authedAs={props.authedAs} />
      </Grid>
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

const mapDispatchToProps = (dispatch) => {
  return {
    setModalState: (modalState, text) =>
      dispatch(setModalStateAction({ showModal: modalState, text })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
