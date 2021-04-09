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
import React, { useEffect, useRef, useState } from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SearchResultModal from "./SearchResultModal";
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
    transition: "all .4s ease-in-out",
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

const Header = (props) => {
  const classes = useStyles();
  const [currPath, setCurrPath] = useState("");
  const location = useLocation();
  const [searchBarFocused, setSearchBarFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(0);
  const [searchedItems, setSearchedItems] = useState([]);

  const searchHandler = (e) => {
    const searchQuery = e.target.value;
    setSearchQuery(searchQuery);
    if (!!!searchQuery) {
      return setSearchedItems([]);
    }
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
      }, 100)
    );
  };

  useEffect(() => {
    setCurrPath(location.pathname);
  }, [location]);

  return (
    <AppBar position="sticky" className={classes.appBar}>
      <Toolbar>
        <Grid container item xs={4}>
          <NavLink to="/" className={classes.navlinkStyles}>
            <Typography className={classes.mainHeading}>
              The Project Thing
            </Typography>
          </NavLink>

          <CodeIcon fontSize="large" />
        </Grid>
        <Grid item container xs={8} justify="center">
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
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
          </div>
        </Grid>
        <div className={classes.grow} />
        {!!searchedItems.length && (
          <SearchResultModal
            isFocused={searchBarFocused}
            searchedItems={searchedItems}
          />
        )}
        <Grid item container xs={5} justify="flex-end">
          {!props.auth.authenticated && !currPath.split("/").includes("auth") && (
            <NavLink to="/auth" className={classes.navlinkStyles}>
              <Button className={classes.btn}>Join</Button>
            </NavLink>
          )}
          {props.auth.authenticated && <HeaderMenus />}
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

export default connect(mapStateToProps)(Header);
