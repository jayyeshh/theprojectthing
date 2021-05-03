import {
  AppBar,
  Grid,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Hidden,
} from "@material-ui/core";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import HeaderMenus from "./HeaderMenus";
import CodeIcon from "@material-ui/icons/Code";
import React, { useEffect, useRef, useState } from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import HomeIcon from "@material-ui/icons/Home";
import ExploreIcon from "@material-ui/icons/Explore";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import SearchResultModal from "./SearchResultModal";
import MenuIcon from "@material-ui/icons/Menu";
import { fade, makeStyles } from "@material-ui/core/styles";
import { useConfirm } from "material-ui-confirm";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { connect } from "react-redux";
import axios from "../utility/axios/apiInstance";
import { logoutAction } from "../actions/authActions";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: "#0d47a1",
    transition: "all .4s ease-in-out",
    [theme.breakpoints.down("xs")]: {
      alignItems: "center",
      maxWidth: "100%",
      overflow: "hidden",
      alignItems: "flex-start",
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
  navlinkStyles: {
    color: "#fff",
    textDecoration: "none",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    display: "flex",
    alignSelf: "center",
    alignContent: "center",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    transition: "all ease-in-out .2s",
    "&:focus": {
      border: "1px solid white",
      borderRadius: "4px",
    },
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  searchResults: {
    position: "fixed",
    maxHeight: "12rem",
    overflow: "auto",
    top: "9%",
    left: "20%",
    width: "60%",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    backgroundColor: "white",
    color: "black",
    borderRadius: "2px",
    transition: "all .4s ease-in-out",
    zIndex: "99999999",
  },
  searchResult: {
    padding: "1rem",
    borderBottom: "1px solid grey",
    transition: "all .2s ease-in-out",
    "&:hover": {
      backgroundColor: "#eee",
      cursor: "pointer",
    },
  },
  titleName: {
    alignSelf: "center",
    marginLeft: ".4rem",
  },
  linkStyles: {
    width: "100%",
    textDecoration: "none",
    color: "black",
  },
}));

const getIcon = (text) => {
  switch (text.toUpperCase()) {
    case "HOME":
      return <HomeIcon />;
    case "EXPLORE":
      return <ExploreIcon />;
    case "ADD PROJECT":
      return <AddCircleIcon />;
    case "PROFILE":
      return <AccountCircleIcon />;
    case "LOGOUT":
      return <PowerSettingsNewIcon />;
  }
};

const Header = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const [currPath, setCurrPath] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchBarFocused, setSearchBarFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(0);
  const [searchedItems, setSearchedItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const confirmation = useConfirm();
  const history = useHistory();

  const menusItems = {
    home: "/",
    explore: "/explore",
    "add project": "/projects/add",
  };

  const searchHandler = (e) => {
    setSearching(true);
    const searchQuery = e.target.value;
    setSearchQuery(searchQuery);
    if (!!!searchQuery || !searchQuery.length) {
      return setSearchedItems([]);
    }
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        axios
          .get(`/search/?query=${searchQuery}&type=all`)
          .then((resp) => {
            setSearching(false);
            setSearchedItems(resp.data);
          })
          .catch((error) => {
            setSearching(false);
            setSearchedItems([]);
            console.log("error: ", error);
          });
      }, 100)
    );
  };

  const logoutUser = () => {
    confirmation({
      confirmationText: "Logout",
      confirmationButtonProps: { color: "secondary" },
    })
      .then(() => {
        props.logout();
      })
      .catch(() => {});
  };

  useEffect(() => {
    setCurrPath(location.pathname);
  }, [location]);

  return (
    <AppBar position="sticky" className={classes.appBar}>
      <Toolbar>
        <Hidden mdUp>
          <MenuIcon onClick={() => setDrawerOpen(true)} />
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <List style={{ backgroundColor: "#efefef", height: "100%" }}>
              {Object.keys(menusItems)
                .filter(
                  (menu) =>
                    menu !== "add project" ||
                    (props.auth.authenticated &&
                      props.auth.as.toLowerCase() === "developer")
                )
                .map((text, index) => (
                  <NavLink
                    key={text}
                    to={menusItems[text]}
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    <ListItem button onClick={() => setDrawerOpen(false)}>
                      <ListItemIcon>{getIcon(text)}</ListItemIcon>
                      <ListItemText primary={text.toUpperCase()} />
                    </ListItem>
                  </NavLink>
                ))}
              {props.auth.authenticated && (
                <>
                  <NavLink
                    to={
                      props.auth.as.toLowerCase() === "developer"
                        ? `/dev/${props.auth.user._id}`
                        : `/company/${props.auth.user._id}`
                    }
                    key="profile"
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    <ListItem button onClick={() => setDrawerOpen(false)}>
                      <ListItemIcon>{getIcon("profile")}</ListItemIcon>
                      <ListItemText primary="PROFILE" />
                    </ListItem>
                  </NavLink>
                  <ListItem button key="logout" onClick={() => logoutUser()}>
                    <ListItemIcon>{getIcon("LOGOUT")}</ListItemIcon>
                    <ListItemText primary="LOGOUT" />
                  </ListItem>
                </>
              )}
            </List>
            <Divider />
          </Drawer>
        </Hidden>
        <Grid container item xs={4}>
          <Hidden smDown>
            <NavLink to="/" className={classes.navlinkStyles}>
              <Typography className={classes.mainHeading}>
                The Project Thing
              </Typography>
            </NavLink>
            <CodeIcon fontSize="large" />
          </Hidden>
        </Grid>
        <Grid item container xs={12} md={8} justify="center">
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                setSearchBarFocused(false);
                history.push(`/search/?q=${searchQuery}&type=all`);
              }}
            >
              <InputBase
                placeholder="Search…"
                autoComplete="off"
                onFocus={() => setSearchBarFocused(true)}
                onBlur={() => {
                  if (!!!searchQuery) {
                    setSearchedItems([]);
                  }
                  setTimeout(() => {
                    setSearchBarFocused(false);
                  }, 300);
                }}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
                value={searchQuery}
                onChange={searchHandler}
              />
            </form>
          </div>
        </Grid>
        <div className={classes.grow} />
        {searchBarFocused && (
          <SearchResultModal
            isFocused={searchBarFocused}
            searchedItems={searchedItems}
            searching={searching}
            searchQuery={searchQuery}
          />
        )}
        <Grid item container xs={5} justify="flex-end">
          {!props.auth.authenticated && !currPath.split("/").includes("auth") && (
            <NavLink to="/auth" className={classes.navlinkStyles}>
              <Button className={classes.btn}>Join</Button>
            </NavLink>
          )}

          <Hidden xsDown>
            {props.auth.authenticated && (
              <HeaderMenus logoutUser={logoutUser} />
            )}
          </Hidden>
        </Grid>
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
    logout: () => {
      dispatch(logoutAction());
      window.location.href = "/";
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
