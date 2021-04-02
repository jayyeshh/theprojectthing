import {
  AppBar,
  Grid,
  Toolbar,
  Typography,
  Button,
  Tooltip,
} from "@material-ui/core";
import { NavLink, useHistory } from "react-router-dom";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import PowerSettingsNewOutlinedIcon from "@material-ui/icons/PowerSettingsNewOutlined";
import CodeIcon from "@material-ui/icons/Code";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { logoutAction } from "../actions/authActions";

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
  const history = useHistory();

  const logout = () => {
    props.logout();
  };

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
        {!props.auth.authenticated &&
          !history.location.pathname.split("/").includes("auth") && (
            <NavLink to="/auth" className={classes.navlinkStyles}>
              <Button className={classes.btn}>Join</Button>
            </NavLink>
          )}
        {props.auth.authenticated && (
          <>
            {true && (
              <NavLink className={classes.navlinkStyles} to="/projects/add">
                <Tooltip title="add project">
                  <AddCircleOutlineIcon className={classes.btnStyles} />
                </Tooltip>
              </NavLink>
            )}
            {true && <Button className={classes.btn}>B</Button>}
            {true && <Button className={classes.btn}>C</Button>}
            <Tooltip title="logout">
              <PowerSettingsNewOutlinedIcon
                className={classes.btnStyles}
                onClick={() => logout()}
              />
            </Tooltip>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.authReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logoutAction()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
