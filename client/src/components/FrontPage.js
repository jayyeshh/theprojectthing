import React, { useEffect, useState } from "react";
import { Grid, Typography, Button, Card, Hidden } from "@material-ui/core";
import { useHistory } from "react-router";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import axios from "../utility/axios/apiInstance";

const colors = [
  "#f0f8ff",
  "#e7feff",
  "#d8e8e6",
  "#e8f4f7",
  "#ecf1ec",
  "#edf1fe",
  "#e7feff",
  "#a6e7ff",
  "#c6e3f7",
];

const useStyles = makeStyles((theme) => ({
  mainHeading: {
    fontFamily: "Acme",
    fontSize: "3.5rem",
    marginRight: ".6rem",
  },
  btnStyles: {
    margin: ".4rem 0",
    width: "100%",
  },
  linkStyles: {
    textDecoration: "none",
    color: "black",
  },
  mainBlock: {
    marginTop: "4rem",
    [theme.breakpoints.down("xs")]: {
      margin: 0,
    },
  },
  container: {
    minWidth: "100%",
    transition: "all .7s ease-in-out",
    minHeight: "90vh",
    paddingTop: "6rem",
    [theme.breakpoints.down("xs")]: {
      minHeight: "92.3vh",
    },
  },
}));

const FrontPage = (props) => {
  const history = useHistory();
  const [bgColor, setBgColor] = useState("#fff");
  const [stats, setStats] = useState({});
  const classes = useStyles();
  if (props.isAuthenticated) history.push("/dashboard");
  useEffect(async () => {
    const interval = setInterval(() => {
      setBgColor(colors[Math.floor(Math.random() * colors.length)]);
    }, 3000);

    try {
      const resp = await axios.get("/stats");
      setStats(resp.data);
    } catch (error) {
      console.log("Something went wrong!", error);
    }

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <Grid
      container
      direction="column"
      className={classes.container}
      style={{
        backgroundColor: bgColor,
      }}
    >
      <Grid
        item
        container
        align="center"
        justify="center"
        xs={12}
        className={classes.mainBlock}
      >
        <Typography className={classes.mainHeading}>
          The Project Thing
        </Typography>
      </Grid>
      <Grid
        item
        container
        direction="column"
        align="center"
        justify="center"
        alignContent="center"
        style={{
          padding: '.8rem'
        }}
      >
        <Typography>
          Explore the Community of Developers, Web Designers, Coders,
          Programmers...
        </Typography>
        <Typography>
          {" "}
          Or Join to show your skills and get in touch with your dream company
        </Typography>
        <NavLink className={classes.linkStyles} to="/explore">
          <Button className={classes.btnStyles} variant="outlined">
            Explore as Guest
          </Button>
        </NavLink>
        <NavLink to="/auth" className={classes.linkStyles}>
          <Button className={classes.btnStyles} variant="outlined">
            Join
          </Button>
        </NavLink>
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
