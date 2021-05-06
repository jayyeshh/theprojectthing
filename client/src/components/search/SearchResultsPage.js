import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  makeStyles,
  Avatar,
  Button,
  Hidden,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import axios from "../../utility/axios/apiInstance";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import { getProjects } from "../../utility/utilityFunctions/ApiCalls";
import Spinner from "../spinners/Spinner";
import SideSuggestionBlock from "../shared/SideSuggestionBlock";

const useStyles = makeStyles((theme) => ({
  baseContainer: {
    backgroundColor: "#DAE0E6",
    minHeight: "100vh",
  },
  container: {
    minWidth: "100%",
    minHeight: "100%",
  },
  topBox: {
    maxHeight: "6rem",
    padding: "1rem",
    background: "white",
  },
  filtersRow: {
    padding: ".6rem",
    borderBottom: "1px solid #aaa",
    marginBottom: ".7rem",
  },
  filterBlock: {
    color: "gray",
    padding: ".1rem",
    "&:hover": {
      color: "black",
      cursor: "pointer",
    },
  },
  result: {
    background: "white",
    margin: ".4rem 1rem",
    minHeight: "4rem",
    borderRadius: "4px",
    padding: ".1rem 1rem",
    transition: "all 0.2s ease-in-out",
    border: "1px solid gray",
    [theme.breakpoints.down("md")]: {
      width: "91%",
    },
  },
  avatarStyles: {
    padding: ".7rem",
    paddingRight: 0,
    border: "1px solid black",
  },
  link: {
    textDecoration: "none",
  },
  titleStyles: {
    color: "black",
    "&:hover": {
      cursor: "pointer",
      color: "#555",
    },
  },
  resultsContainer: {},
  suggestionContainer: {
    padding: ".4rem 1rem 1rem 1rem",
  },
  suggestionSubContainer: {
    background: "white",
    maxWidth: "95%",
    padding: ".4rem 1rem 1rem 1rem",
  },
}));

const FilterBlock = ({ label, active, typeText, clickHandler }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      justify="center"
      className={classes.filterBlock}
      onClick={clickHandler}
      style={{
        color: `${active ? "black" : "gray"}`,
      }}
    >
      <Typography>{label}</Typography>
    </Grid>
  );
};

const filterBlockItems = [
  {
    label: "All",
    typeText: "all",
  },
  {
    label: "Posts",
    typeText: "posts",
  },
  {
    label: "Tag",
    typeText: "tag",
  },
  {
    label: "Companies",
    typeText: "companies",
  },
  {
    label: "Developers",
    typeText: "developers",
  },
  {
    label: "Projects",
    typeText: "projects",
  },
];

const SearchResultsPage = (props) => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  const qs = new URLSearchParams(props.location.search);
  useEffect(() => {
    setQuery(qs.get("q"));
    let queryType = qs.get("type");
    let queryString = qs.get("q");
    setQuery(queryString);
    if (!queryType) {
      qs.set("type", "all");
      history.replace({ search: qs.toString() });
      queryType = "all";
    }
    setType(queryType);
    getResults();
    getProjects()
      .then((resp) => {
        const randomSuggestions = _.shuffle(resp.data, 5);
        setSuggestions(randomSuggestions.slice(0, 15));
        setSuggestionsLoading(false);
      })
      .catch((error) => {
        setSuggestionsLoading(false);
        console.log("Something went wrong!", error);
      });
  }, [type, qs.get("q")]);

  const getResults = async () => {
    setLoading(true);
    setResults([]);
    const configs = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    try {
      const results = await axios.get(
        `/search/?query=${query}&type=${type}`,
        configs
      );
      setResults(results.data);
      console.log("type: ", type, results.data);
      setLoading(false);
    } catch (error) {
      console.log("[log]: Error while fetching search results: ", error);
      setLoading(false);
    }
  };

  const switchType = (newType) => {
    if (newType !== type) {
      setLoading(true);
      setResults([]);
      setType(newType);
      qs.set("type", newType);
      history.replace({ search: qs.toString() });
      setLoading(false);
    }
  };

  return (
    <Grid
      item
      xs={12}
      container
      direction="column"
      className={classes.baseContainer}
    >
      <Grid
        item
        xs={12}
        container
        direction="column"
        className={classes.topBox}
      >
        <Typography
          variant="h5"
          color="textSecondary"
          style={{
            fontSize: "1rem",
          }}
        >
          showing results for:
        </Typography>
        <Typography
          variant="h3"
          style={{
            fontSize: "1.4rem",
          }}
        >
          {query}
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        container
        direction="column"
        className={classes.resultContainer}
      >
        <Grid
          item
          md={8}
          xs={12}
          container
          direction="row"
          className={classes.filtersRow}
          style={{
            flexWrap: "nowrap",
          }}
        >
          {filterBlockItems.map((item) => {
            return (
              <FilterBlock
                key={item.typeText}
                label={item.label}
                active={type === item.typeText}
                typeText={item.typeText}
                clickHandler={() => switchType(item.typeText)}
              />
            );
          })}
        </Grid>
        <Grid container direction="row" className={classes.resultBlock}>
          <Grid
            item
            md={8}
            xs={12}
            container
            direction="column"
            className={classes.resultsContainer}
          >
            {loading ? (
              <Grid
                container
                direction="row"
                justify="center"
                style={{
                  marginTop: "4rem",
                }}
              >
                <Spinner />
              </Grid>
            ) : results.length ? (
              results.map((result) => {
                switch (type) {
                  case "all": {
                    return (
                      <Grid
                        container
                        direction="column"
                        justify="center"
                        key={result._id}
                        className={`${classes.result}`}
                      >
                        {result.body && (
                          <>
                            <NavLink
                              to={`/post/${result._id}`}
                              className={classes.link}
                            >
                              <Typography className={classes.titleStyles}>
                                {result.title}
                              </Typography>
                            </NavLink>
                            <Grid container direction="row">
                              <Typography>by: </Typography>
                              <NavLink
                                to={`/dev/${result.author._id}`}
                                className={classes.link}
                              >
                                <Typography
                                  style={{
                                    marginLeft: ".4rem",
                                    color: "#777",
                                  }}
                                >
                                  {result.author.name}
                                </Typography>
                              </NavLink>
                            </Grid>
                          </>
                        )}
                        {!result.body && result.title && (
                          <>
                            <NavLink
                              to={`/projects/${result._id}`}
                              className={classes.link}
                            >
                              <Typography className={classes.titleStyles}>
                                {result.title}
                              </Typography>
                            </NavLink>
                            <Grid container direction="row">
                              <Typography>by: </Typography>
                              <NavLink
                                to={`/dev/${result._id}`}
                                className={classes.link}
                              >
                                <Typography
                                  style={{
                                    marginLeft: ".4rem",
                                    color: "#777",
                                  }}
                                >
                                  {result.developer.username}
                                </Typography>
                              </NavLink>
                            </Grid>
                          </>
                        )}

                        {!result.body && !result.title && (
                          <Grid container direction="row">
                            <Grid
                              item
                              xs={1}
                              style={{
                                maxWidth: "3.2rem",
                              }}
                            >
                              <Avatar />
                            </Grid>
                            <Grid>
                              {/* <NavLink
                                to={`/company/${result._id}`}
                                className={classes.link}
                              > */}
                              <Typography style={{ color: "#000" }}>
                                {result.name}
                              </Typography>
                              {/* </NavLink> */}
                              <Typography style={{ color: "#777" }}>
                                @{result.username}
                              </Typography>
                            </Grid>
                          </Grid>
                        )}
                      </Grid>
                    );
                  }
                  case "posts": {
                    return (
                      <Grid
                        container
                        direction="column"
                        justify="center"
                        key={result._id}
                        className={`${classes.result}`}
                      >
                        <NavLink
                          to={`/post/${result._id}`}
                          className={classes.link}
                        >
                          <Typography className={classes.titleStyles}>
                            {result.title}
                          </Typography>
                        </NavLink>
                        <Grid container direction="row">
                          <Typography>by: </Typography>
                          <NavLink
                            to={`/company/${result.author._id}`}
                            className={classes.link}
                          >
                            <Typography
                              style={{
                                marginLeft: ".4rem",
                                color: "#777",
                              }}
                            >
                              {result.author.name}
                            </Typography>
                          </NavLink>
                        </Grid>
                      </Grid>
                    );
                  }
                  case "projects":
                  case "tag": {
                    return (
                      <Grid
                        container
                        direction="column"
                        justify="center"
                        key={result._id}
                        className={`${classes.result}`}
                      >
                        <NavLink
                          to={`/projects/${result._id}`}
                          className={classes.link}
                        >
                          <Typography className={classes.titleStyles}>
                            {result.title}
                          </Typography>
                        </NavLink>
                        <Grid container direction="row">
                          <Typography>by: </Typography>
                          <NavLink
                            to={`/dev/${result._id}`}
                            className={classes.link}
                          >
                            <Typography
                              style={{
                                marginLeft: ".4rem",
                                color: "#777",
                              }}
                            >
                              {!!result.developer && result.developer.name}
                            </Typography>
                          </NavLink>
                        </Grid>
                      </Grid>
                    );
                  }
                  case "developers":
                    return (
                      <Grid
                        container
                        direction="column"
                        alignItems="center"
                        key={result._id}
                        className={`${classes.result}`}
                        style={{
                          maxHeight: "4rem",
                          padding: ".4rem",
                        }}
                      >
                        <Grid
                          item
                          xs={1}
                          container
                          style={{
                            maxWidth: "3.2rem",
                          }}
                        >
                          <Avatar />
                        </Grid>
                        <Grid item xs={10} container direction="column">
                          <NavLink
                            to={`/dev/${result._id}`}
                            className={classes.link}
                          >
                            <Typography style={{ color: "#000" }}>
                              {result.name}
                            </Typography>
                          </NavLink>
                          <Typography style={{ color: "#777" }}>
                            @{result.username}
                          </Typography>
                        </Grid>
                        {props.isAuthenticated &&
                          props.authedAs === "developer" && (
                            <Grid item xs={1} container>
                              <Button color="primary">Follow</Button>
                            </Grid>
                          )}
                      </Grid>
                    );
                  case "companies": {
                    return (
                      <Grid
                        item
                        xs={12}
                        container
                        direction="row"
                        alignItems="center"
                        key={result._id}
                        className={`${classes.result}`}
                        style={{
                          maxHeight: "4rem",
                          padding: ".4rem",
                        }}
                      >
                        <Grid
                          item
                          xs={1}
                          container
                          style={{
                            maxWidth: "3.2rem",
                          }}
                        >
                          <Avatar />
                        </Grid>
                        <Grid>
                          <NavLink
                            to={`/company/${result._id}`}
                            className={classes.link}
                          >
                            <Typography style={{ color: "#000" }}>
                              {result.name}
                            </Typography>
                          </NavLink>
                          <Typography style={{ color: "#777" }}>
                            @{result.username}
                          </Typography>
                        </Grid>
                      </Grid>
                    );
                  }
                }
              })
            ) : (
              <Grid
                container
                justify="center"
                style={{
                  marginTop: "1rem",
                }}
              >
                <Typography
                  style={{
                    fontSize: "1.3rem",
                    color: "#555",
                    fontFamily: "Loto Sans JP",
                    fontWeight: 600,
                  }}
                >
                  No result found
                </Typography>
              </Grid>
            )}
          </Grid>
          <Hidden mdDown>
            <Grid item xs={4} className={classes.suggestionContainer}>
              <Grid
                container
                direction="column"
                alignItems="center"
                className={classes.suggestionSubContainer}
                style={{
                  marginLeft: "1rem",
                }}
              >
                {!suggestions.length ? (
                  <Grid
                    item
                    xs={12}
                    container
                    justify="center"
                    style={{ marginTop: "4rem" }}
                  >
                    <Spinner />
                  </Grid>
                ) : (
                  <Grid container>
                    {suggestions.map((project) => (
                      <SideSuggestionBlock project={project} />
                    ))}
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Hidden>
        </Grid>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.authReducer.authenticated,
    authedAs: state.authReducer.as ? state.authReducer.as.toLowerCase() : "",
  };
};

export default connect(mapStateToProps, null)(SearchResultsPage);
