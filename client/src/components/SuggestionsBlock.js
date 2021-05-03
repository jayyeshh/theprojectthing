import React, { useState, useEffect } from "react";
import { Avatar, Grid, makeStyles, Typography } from "@material-ui/core";
import {
  getCompanies,
  getDevelopers,
  getPosts,
  getProjects,
} from "../utility/utilityFunctions/ApiCalls";
import ListAlt from "@material-ui/icons/ListAlt";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import SideSuggestionBlock from "./SideSuggestionBlock";

const useStyles = makeStyles((theme) => ({
  container: {
    flexWrap: "nowrap",
  },
  wrapperGrid: {
    backgroundColor: "#fff",
    borderRadius: "4px",
    minHeight: "4rem",
  },
  blockTitle: {
    fontFamily: "Lato",
    fontWeight: 550,
    fontSize: "1.4rem",
  },
  blockWrapper: {
    marginBottom: "1rem",
  },
  companyBlock: {
    minHeight: "4rem",
    maxHeight: "4rem",
    borderBottom: "1px solid #aeaeae",
    borderRadius: "2px",
    padding: ".3rem 1rem",
    transition: ".1s ease-in-out all",
    "&:hover": {
      backgroundColor: "#eeeeee",
    },
  },
  link: {
    textDecoration: "none",
    color: "#434343",
    "&:hover": {
      color: "blue",
    },
  },
  linkBlock: {
    textDecoration: "none",
    color: "black",
  },
  profileBlock: {
    maxHeight: "5rem",
    padding: "0 1rem",
    transition: "all ease-in-out .1s",
    "&:hover": {
      backgroundColor: "#efefef",
      cursor: "pointer",
    },
  },
  moreType: {
    maxHeight: "2rem",
    minHeight: "2rem",
    padding: "6px 0 0 18px",
    color: "white",
    backgroundColor: "#8e8e8e",
    transition: "all .2s ease-in-out",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#b4b4b4",
      color: "blue",
    },
  },
  title: {
    fontFamily: "Noto Sans JP",
    fontWeight: 500,
    fontSize: "1.2rem",
    margin: '.5rem 0',
  },
  jobBlock: {
    background: "white",
    marginBottom: "1rem",
    padding: ".4rem",
    border: '1px solid #eee'
  },
}));

const CompanyBlock = ({ company }) => {
  const classes = useStyles();
  return (
    <Grid className={classes.companyBlock}>
      <Grid
        container
        style={{
          flex: 1,
          height: "2.5rem",
        }}
      >
        <NavLink to={`/company/${company._id}`} className={classes.link}>
          <Typography>{company.name}</Typography>
        </NavLink>
      </Grid>
      <Grid
        container
        direction="row"
        style={{
          maxHeight: "1rem",
          alignSelf: "flex-end",
          color: "gray",
        }}
      >
        <ListAlt />
        <Typography style={{ marginLeft: ".3rem" }}>
          {company.posts.length}
        </Typography>
      </Grid>
    </Grid>
  );
};

const DeveloperBlock = ({ developer }) => {
  const classes = useStyles();
  return (
    <Grid className={classes.companyBlock}>
      <Grid
        container
        style={{
          flex: 1,
          height: "2.5rem",
        }}
      >
        <NavLink to={`/dev/${developer._id}`} className={classes.link}>
          <Typography>{developer.name}</Typography>
        </NavLink>
      </Grid>
      <Grid
        container
        direction="row"
        style={{
          maxHeight: "1rem",
          alignSelf: "flex-end",
          color: "gray",
        }}
      >
        <ListAlt />
        <Typography style={{ marginLeft: ".3rem" }}>
          {developer.projects.length}
        </Typography>
      </Grid>
    </Grid>
  );
};
const SuggestionsBlock = ({ user, authedAs, ...props }) => {
  const classes = useStyles();
  const [companies, setCompanies] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  useEffect(() => {
    getCompanies()
      .then((resp) => {
        const fetchedCompanies = _.shuffle(resp.data).slice(0, 5);
        setCompanies(fetchedCompanies);
      })
      .catch((error) => {
        console.log("Couldn't fetch companies!");
      });
    getDevelopers()
      .then((resp) => {
        const fetchedDevelopers = _.shuffle(resp.data).slice(0, 5);
        setDevelopers(fetchedDevelopers);
      })
      .catch((error) => {
        console.log("Couldn't fetch Developers!");
      });
    getPosts()
      .then((resp) => {
        const fetchedPosts = _.shuffle(resp.data).slice(0, 10);
        setJobPosts(fetchedPosts);
      })
      .catch((error) => {
        console.log("couldn't fetch Posts");
      });

    getProjects()
      .then((resp) => {
        const fetchedProjects = _.shuffle(resp.data).slice(0, 10);
        setProjects(fetchedProjects);
      })
      .catch((error) => {
        console.log("couldn't fetch Posts");
      });
  }, []);
  return (
    <Grid
      item
      xs={12}
      container
      direction="column"
      className={classes.container}
    >
      <Grid className={classes.blockWrapper}>
        <Typography className={classes.title}>Profile</Typography>
        <NavLink
          to={
            authedAs.toLowerCase() === "company"
              ? `/company/${user._id}`
              : `/dev/${user._id}`
          }
          className={classes.linkBlock}
        >
          <Grid
            item
            xs={12}
            container
            direction="row"
            alignContent="center"
            className={`${classes.wrapperGrid} ${classes.profileBlock}`}
          >
            <Grid item xs={2} container alignItems="center">
              <NavLink to={`/dev/${user._id}`}>
                <Avatar variant="rounded" />
              </NavLink>
            </Grid>
            <Grid item xs={9} container direction="column" justify="center">
              <Typography>{user.name.toUpperCase()}</Typography>
              <Typography
                style={{
                  color: "#7e7e7e",
                  fontSize: ".9rem",
                }}
              >
                @{user.username}
              </Typography>
            </Grid>
          </Grid>
        </NavLink>
      </Grid>
      <Grid container>
        <Typography className={classes.title}>Jobs</Typography>
        {jobPosts.map((post) => (
          <Grid container direction="column" className={classes.jobBlock}>
            <NavLink
              to={`/post/${post._id}`}
              className={classes.link}
              style={{ color: "black" }}
            >
              <Typography
                style={{
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "1rem",
                }}
                className={classes.title}
              >
                {post.title}
              </Typography>
            </NavLink>
            <NavLink
              to={`/company/${post.author._id}`}
              className={classes.link}
            >
              <Typography
                style={{
                  color: "#555",
                }}
              >
                {post.author.name}
              </Typography>
            </NavLink>
            <Grid container>
              <Typography>Posted on: </Typography>
              <Typography
                style={{
                  color: "#555",
                  marginLeft: ".3rem",
                }}
              >
                {new moment(post.createdAt).format("YYYY, MMM DD")}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>

      <Grid className={classes.blockWrapper}>
        <Typography className={classes.title}>Projects</Typography>
        {projects.map((project) => (
          <SideSuggestionBlock project={project} />
        ))}
      <NavLink to={`/explore/?tab=projects`} className={classes.link}>
        <Typography className={classes.moreType}>view more</Typography>
      </NavLink>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.user,
    authedAs: state.authReducer.as,
  };
};

export default connect(mapStateToProps, null)(SuggestionsBlock);
