import React from "react";
import { Grid, Hidden } from "@material-ui/core";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { setModalStateAction } from "../../actions/modalActions";
import SuggestionsBlock from "../shared/SuggestionsBlock";
import Home from "./Home";

const useStyles = makeStyles((theme) => ({
  dashboardContainer: {
    flexWrap: "nowrap",
    overflow: "none",
    background: "#F3F3F3",
    [theme.breakpoints.down("xs")]: {},
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
  suggestionsBlock: {
    width: "100%",
    padding: "1rem 2rem",
  },
}));

const Dashboard = (props) => {
  const classes = useStyles();
  return (
    <Grid
      item
      xs={12}
      container
      direction="row"
      className={classes.dashboardContainer}
    >
      <Grid
        item
        md={8}
        xs={12}
        container
        direction="column"
        className={classes.homePageContainer}
        align="center"
      >
        <Home setModalState={props.setModalState} authedAs={props.authedAs} />
      </Grid>
      <Hidden smDown>
        <Grid
          item
          xs={4}
          container
          direction="column"
          className={classes.suggestionsBlock}
        >
          <SuggestionsBlock />
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
