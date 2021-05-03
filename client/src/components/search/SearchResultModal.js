import React from "react";
import { Typography, Grid, Paper, Avatar } from "@material-ui/core";
import CodeIcon from "@material-ui/icons/Code";
import { NavLink } from "react-router-dom";
import Spinner from "../spinners/Spinner";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  searchResults: {
    position: "fixed",
    maxHeight: "12rem",
    overflow: "auto",
    top: "9%",
    left: "30%",
    width: "40%",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    backgroundColor: "white",
    color: "black",
    borderRadius: "2px",
    transition: "all .4s ease-in-out",
    zIndex: "99999999",
    [theme.breakpoints.down("xs")]: {
      width: "80%",
      left: "10%",
    },
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

const SearchResultModal = ({
  isFocused,
  searchedItems,
  searching,
  searchQuery,
}) => {
  const classes = useStyles();

  if (isFocused && !searchedItems.length && searching && searchQuery) {
    return (
      <Paper elevation={6} className={classes.searchResults}>
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{
            minHeigth: "4rem",
            margin: "1rem",
            maxWidth: "90%",
          }}
        >
          <Spinner />
        </Grid>
      </Paper>
    );
  }

  return (
    <Paper elevation={6} className={classes.searchResults}>
      {isFocused && !searchedItems.length && !searching && searchQuery ? (
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{
            margin: "1rem",
            maxWidth: "90%",
          }}
        >
          <Typography color="textSecondary">No Result Found!</Typography>
        </Grid>
      ) : (
        <Grid container>
          {isFocused &&
            searchedItems.map((item) => {
              if (item.body) {
                return (
                  <NavLink
                    key={item._id}
                    to={`/post/${item._id}`}
                    className={classes.linkStyles}
                  >
                    <Grid
                      container
                      alignContent="center"
                      direction="row"
                      alignItems="center"
                      justify="flex-start"
                      className={classes.searchResult}
                    >
                      <Typography
                        className={classes.titleName}
                        style={{
                          width: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.title.length < 40
                          ? item.title
                          : item.title.substr(0, 37) + "..."}
                      </Typography>
                    </Grid>
                  </NavLink>
                );
              } else if (item.title) {
                return (
                  <NavLink
                    key={item._id}
                    to={`/projects/${item._id}`}
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
              } else if (item.username && !!item.hasOwnProperty("posts")) {
                return (
                  <NavLink
                    key={item._id}
                    to={`/company/${item._id}`}
                    className={classes.linkStyles}
                  >
                    <Grid
                      item
                      container
                      align="center"
                      alignContent="center"
                      direction="row"
                      className={classes.searchResult}
                      justify="flex-start"
                    >
                      <Avatar>
                        <AccountCircleIcon />
                      </Avatar>
                      <Typography className={classes.titleName}>
                        {item.username}
                      </Typography>
                    </Grid>
                  </NavLink>
                );
              } else if (item.username) {
                return (
                  <NavLink
                    key={item._id}
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
      )}
    </Paper>
  );
};

export default SearchResultModal;
