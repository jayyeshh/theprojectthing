import { AppBar, Grid, Toolbar, Typography, Button } from "@material-ui/core";
import { NavLink, useLocation } from "react-router-dom";
import HeaderMenus from "./HeaderMenus";
import CodeIcon from "@material-ui/icons/Code";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#0d47a1",
    [theme.breakpoints.down("xs")]: {
      alignItems: "center",
    },
  },
  mainHeading: {
    fontFamily: "Patrick Hand",
    fontSize: "1.5rem",
    marginRight: ".6rem",
  },
  btn: {
    color: "#fff",
    fontStyle: "bold",
    fontSize: "1.2rem",
  },
  btnStyles: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  gridStyles: {
    display: "flex",
    alignItems: "center",
  },
  navlinkStyles: {
    color: "#fff",
    textDecoration: "none",
  },
}));

const Header = (props) => {
  const classes = useStyles();
  const [currPath, setCurrPath] = useState("");
  const location = useLocation();

  useEffect(() => {
    setCurrPath(location.pathname);
  }, [location]);

  return (
    <AppBar position="sticky" className={classes.appBar}>
      <Toolbar>
        <Grid className={classes.gridStyles} container>
          <NavLink to="/" className={classes.navlinkStyles}>
            <Typography className={classes.mainHeading}>
              The Project Thing
            </Typography>
          </NavLink>

          <CodeIcon fontSize="large" />
        </Grid>
        {!props.auth.authenticated && !currPath.split("/").includes("auth") && (
          <NavLink to="/auth" className={classes.navlinkStyles}>
            <Button className={classes.btn}>Join</Button>
          </NavLink>
        )}
        {props.auth.authenticated && <HeaderMenus />}
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.authReducer,
  };
};

export default connect(mapStateToProps)(Header);
