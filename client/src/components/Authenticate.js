import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import AuthCard from "./AuthCard";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  headQuoteStyles: {
    color: theme.palette.grey[600],
    margin: theme.spacing(5),
  },
}));

const Authenticate = (props) => {
  const classes = useStyles();
  return (
    <div>
      {props.isAuthenticated && <Redirect to="/" />}
      <Grid
        container
        alignContent="center"
        justify="center"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.headQuoteStyles} variant="h4">
            A Social Platform for Developers
          </Typography>
        </Grid>
        <Grid
          item
          container
          alignContent="center"
          justify="space-evenly"
          alignItems="center"
        >
          <AuthCard
            title="As Company"
            para="Join as company to find skilled developers for your company and get in touch with global community of developers!"
            for="company"
          />
          <AuthCard
            title="As Developer"
            para="Join the community of developers to share your projects with others and get new ideas for projects to work on!"
            for="developer"
          />
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.authReducer.authenticated,
  };
};

export default connect(mapStateToProps)(Authenticate);
