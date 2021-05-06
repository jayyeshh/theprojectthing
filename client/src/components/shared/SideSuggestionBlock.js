import React from "react";
import { makeStyles, Grid, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { Slash } from "react-feather";

const useStyles = makeStyles((theme) => ({
  sideProjectBlock: {
    minHeight: "6rem",
    minWidth: "22rem",
    margin: ".6rem 0",
    padding: ".2rem",
    boxShadow: "1px 1px 10px gray",
    transition: "all ease-in-out .1s",
    "&:hover": {
      cursor: "pointer",
      boxShadow: "1px 4px 14px 4px gray",
      transform: "scale(1.02)",
    },
  },
  link: {
    textDecoration: "none",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const SideSuggestionBlock = ({ project }) => {
  const classes = useStyles();
  return (
    <NavLink to={`/projects/${project._id}`} className={classes.link}>
      <Grid container direction="row" className={classes.sideProjectBlock}>
        <Grid item xs={5}>
          {!!project.photos && !!project.photos.length ? (
            <img
              style={{
                width: "8.4rem",
                minHeight: "100%",
              }}
              src={project.photos[0]}
            />
          ) : (
            <Grid
              container
              justify="center"
              alignItems="center"
              style={{
                background: "#ccc",
                maxWidth: "8rem",
                minHeight: "98%",
                color: "gray",
              }}
            >
              <Slash />
            </Grid>
          )}
        </Grid>
        <Grid item xs={7} container direction="column">
          <Typography
            style={{
              color: "black",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {project.title}
          </Typography>
          <Typography
            style={{
              color: "#666",
            }}
          >
            {project.developer.name}
          </Typography>
        </Grid>
      </Grid>
    </NavLink>
  );
};

export default SideSuggestionBlock;
