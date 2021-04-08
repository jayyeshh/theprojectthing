import {
  AppBar,
  Grid,
  Toolbar,
  Typography,
  Button,
  Paper,
  Avatar,
} from "@material-ui/core";
import { NavLink, useLocation } from "react-router-dom";
import HeaderMenus from "./HeaderMenus";
import CodeIcon from "@material-ui/icons/Code";
import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { fade, makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { connect } from "react-redux";
import axios from "../utility/axios/apiInstance";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
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
    width: '100%',
    textDecoration: 'none',
    color: 'black'
  }
}));

const Header = (props) => {
  const classes = useStyles();
  const [currPath, setCurrPath] = useState("");
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(0);
  const [searchedItems, setSearchedItems] = useState([]);

  const searchHandler = (e) => {
    const searchQuery = e.target.value;
    setSearchQuery(searchQuery);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        axios
          .get(`/search/?query=${searchQuery}`)
          .then((resp) => {
            setSearchedItems(resp.data);
          })
          .catch((error) => {
            setSearchedItems([]);
            console.log("error: ", error);
          });
      }, 300)
    );
  };

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
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            value={searchQuery}
            onChange={searchHandler}
          />
        </div>
        <div className={classes.grow} />
        {!!searchedItems.length && (
          <Paper elevation={4} className={classes.searchResults}>
            <Grid container>
              {searchedItems.map((item) => {
                if (item.title) {
                  return (
                    <NavLink
                      to={`/project/${item._id}`}
                      className={classes.linkStyles}
                    >
                      <Grid
                        xs={12}
                        item
                        container
                        align="center"
                        alignContent="center"
                        direction="row"
                        justify="flex-start"
                        className={classes.searchResult}
                      >
                        <Avatar>
                          <CodeIcon />
                        </Avatar>
                        <Typography className={classes.titleName}>
                          {item.title}
                        </Typography>
                      </Grid>
                    </NavLink>
                  );
                } else if (item.username && !!item.db) {
                  return (
                    <NavLink
                      to={`/company/${item._id}`}
                      className={classes.linkStyles}
                    >
                      <Grid
                        item
                        container
                        align="center"
                        alignContent="center"
                        direction="row"
                        justify="flex-start"
                      >
                        <Avatar>
                          <AccountCircleIcon />
                        </Avatar>
                        <Typography className={classes.titleName}>
                          {item.title}
                        </Typography>
                      </Grid>
                    </NavLink>
                  );
                } else if (item.username) {
                  return (
                    <NavLink
                      to={`/dev/${item._id}`}
                      className={classes.linkStyles}
                    >
                      <Grid
                        item
                        container
                        align="center"
                        alignContent="center"
                        direction="row"
                        justify="flex-start"
                        className={classes.searchResult}
                      >
                        <Avatar>{item.username.charAt(0)}</Avatar>
                        <Typography className={classes.titleName}>
                          {item.username}
                        </Typography>
                      </Grid>
                    </NavLink>
                  );
                }
              })}
            </Grid>
          </Paper>
        )}
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
