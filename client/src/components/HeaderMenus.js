import { Grid, Tooltip } from "@material-ui/core";
import React from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink, useHistory } from "react-router-dom";
import PowerSettingsNewOutlinedIcon from "@material-ui/icons/PowerSettingsNewOutlined";
import HomeIcon from "@material-ui/icons/Home";
import ExploreIcon from "@material-ui/icons/Explore";
import { logoutAction } from "../actions/authActions";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  btnStyles: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  navlinkStyles: {
    color: "#fff",
    textDecoration: "none",
  },
}));

const HeaderMenus = (props) => {
  const classes = useStyles();
  return (
    <>
      <Grid style={{ justifyContent: "flex-end" }} container>
        <Grid item style={{ margin: ".4rem" }}>
          <NavLink className={classes.navlinkStyles} to="/dashboard/">
            <Tooltip title="home">
              <HomeIcon />
            </Tooltip>
          </NavLink>
        </Grid>
        <Grid item style={{ margin: ".4rem" }}>
          <NavLink className={classes.navlinkStyles} to="/explore/">
            <Tooltip title="explore">
              <ExploreIcon />
            </Tooltip>
          </NavLink>
        </Grid>
        {props.auth.as === "Developer" && (
          <Grid item style={{ margin: ".4rem" }}>
            <NavLink className={classes.navlinkStyles} to="/projects/add">
              <Tooltip title="add project">
                <AddCircleOutlineIcon className={classes.btnStyles} />
              </Tooltip>
            </NavLink>
          </Grid>
        )}
        <Grid item style={{ margin: ".4rem" }}>
          <Tooltip title="logout">
            <PowerSettingsNewOutlinedIcon
              className={classes.btnStyles}
              onClick={() => props.logoutUser()}
            />
          </Tooltip>
        </Grid>
      </Grid>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.authReducer,
  };
};

export default connect(mapStateToProps, null)(HeaderMenus);
