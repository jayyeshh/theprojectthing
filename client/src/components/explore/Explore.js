import { Grid, IconButton, Paper, Typography } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import axios from "../../utility/axios/apiInstance";
import Spinner from "../spinners/Spinner";
import DevCard from "../cards/DevCard";
import CompanyCard from "../cards/CompanyCard";
import ProjectCard from "../cards/ProjectCard";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paperStyles: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    background: "#F3F3F3",
    minHeight: "100vh",
  },
  headingStyles: {
    display: "inherit",
    flexDirection: "column",
    alignItems: "center",
    position: "fixed",
    height: "9rem",
    width: "100%",
    borderBottom: "1px solid gray",
    zIndex: "1000",
    background: "white",
  },
  pageHeading: {
    fontSize: "2rem",
    margin: "1rem",
    fontWeight: "800",
  },
  mainContainer: {
    marginTop: "10rem",
    padding: "0 8rem",
    overflowY: "hidden",
  },
  cardContainer: {
    [theme.breakpoints.down("xs")]: {
      minWidth: "16rem",
    },
    maxWidth: "18rem",
  },
  sortingBar: {
    width: "100%",
  },
  iconBtnText: {
    marginLeft: ".3rem",
  },
  activeIconBtn: {
    color: "blue",
  },
}));

const Explore = (props) => {
  const classes = useStyles();
  const [type, setType] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredBy, setFilteredBy] = useState("recentlyAdded");
  const configs = {};
  const history = useHistory();
  if (props.isAuthenticated) {
    configs.headers = {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    };
  }
  useEffect(async () => {
    const qs = props.location.search;
    const query = new URLSearchParams(qs);
    let tab = query.get("tab");
    if (!!!tab) tab = "devs";
    if (type !== tab) {
      if (type && type.length) {
        query.set("tab", type);
      }
      history.push({ search: query.toString() });
    }
    if (!!!type) {
      setType(tab);
    }
    setLoading(true);
    let url = `/${type}`;
    if (type === "projects") {
      const queryString = `/?sortby=${filteredBy}`;
      url += queryString;
    }
    axios
      .get(url, configs)
      .then((resp) => {
        setList(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("Something went wrong!", error);
      });
  }, [type, filteredBy]);

  const toggleBtnHandler = (event, newValue) => {
    if (newValue) {
      setList([]);
      setType(newValue);
    }
  };

  return (
    <Paper elevation={0} className={classes.paperStyles}>
      <Paper elevation={4} className={classes.headingStyles}>
        <Typography className={classes.pageHeading}>Explore</Typography>
        <ToggleButtonGroup exclusive value={type} onChange={toggleBtnHandler}>
          <ToggleButton value="projects">
            <Typography>Projects</Typography>
          </ToggleButton>
          <ToggleButton value="devs">
            <Typography>Devs</Typography>
          </ToggleButton>
          <ToggleButton value="companies">
            <Typography>Companies</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>
      <Grid
        container
        justify="center"
        item
        xs={12}
        className={classes.mainContainer}
      >
        {(loading || list.length === 0) && (
          <Grid
            item
            xs={12}
            container
            justify="center"
            alignItems="center"
            style={{
              width: "100%",
              height: "27rem",
            }}
          >
            <Spinner />
          </Grid>
        )}
        {!loading && !!list.length && type === "devs" && (
          <Grid
            item
            container
            spacing={4}
            direction="row"
            justify="center"
            xs={12}
          >
            {list.map((dev, index) => (
              <Grid
                className={classes.cardContainer}
                key={dev._id}
                item
                sm={6}
                md={4}
              >
                <DevCard
                  refresh={(followStatus) => {
                    const updatedList = [...list];
                    updatedList[index].follows = followStatus;
                    setList(updatedList);
                  }}
                  setError={setError}
                  profile={dev}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {!loading && !!list.length && type === "projects" && (
          <Grid item xs={12} container direction="column">
            <Grid
              item
              xs={12}
              container
              direction="row"
              alignItems="center"
              justify="center"
              className={classes.sortingBar}
            >
              <IconButton
                className={
                  filteredBy === "recentlyAdded"
                    ? `${classes.activeIconBtn}`
                    : ""
                }
                onClick={() => setFilteredBy("recentlyAdded")}
              >
                <NewReleasesIcon />
                <Typography className={classes.iconBtnText}>
                  recently added
                </Typography>
              </IconButton>
              <IconButton
                className={
                  filteredBy === "mostVoted" ? `${classes.activeIconBtn}` : ""
                }
                onClick={() => setFilteredBy("mostVoted")}
              >
                <WhatshotIcon />
                <Typography className={classes.iconBtnText}>
                  Most voted
                </Typography>
              </IconButton>
            </Grid>
            <Grid item xs={12} container direction="row" justify="center">
              {list.map((project) => (
                <Grid
                  style={{ minWidth: "18rem" }}
                  key={project._id}
                  item
                  sm={6}
                  md={4}
                >
                  <ProjectCard project={project} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
        {!loading && !!list.length && type === "companies" && (
          <Grid
            item
            xs={12}
            container
            direction="row"
            justify="center"
            spacing={4}
          >
            {list.map((company) => (
              <Grid
                style={{ minWidth: "18rem" }}
                key={company._id}
                item
                className={classes.cardContainer}
                sm={6}
                md={4}
              >
                <CompanyCard setError={setError} profile={company} />
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.authReducer.authenticated,
  };
};

export default connect(mapStateToProps, null)(Explore);
