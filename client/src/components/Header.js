import { AppBar, Grid, Toolbar, Typography, Button } from "@material-ui/core";
import { NavLink, useHistory } from "react-router-dom";
import CodeIcon from "@material-ui/icons/Code";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme=>({
  appBar: {
    backgroundColor: "#0d47a1",
    [theme.breakpoints.down('xs')]:{
      alignItems: 'center',
    }
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
  gridStyles: {
    display: "flex",
    alignItems: "center",
  },
  navlinkStyles: {
    color: "#fff",
    textDecoration: "none",
  },
}));

const Header = () => {
  const classes = useStyles();
  const history = useHistory();
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
        {!history.location.pathname.split('/').includes('auth') && (
          <NavLink to="/auth" className={classes.navlinkStyles}>
            <Button className={classes.btn}>Join</Button>
          </NavLink>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
