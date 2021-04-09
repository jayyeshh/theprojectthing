import { Grid, Paper, Typography } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import axios from "../utility/axios/apiInstance";
import Spinner from "./Spinner";
import DevCard from "./DevCard";
import CompanyCard from "./CompanyCard";
import ProjectCard from "./ProjectCard";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  paperStyles: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
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
}));

const Explore = (props) => {
  const classes = useStyles();
  const [type, setType] = useState("devs");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const configs = {};
  if (props.isAuthenticated) {
    configs.headers = {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    };
  }
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/${type}`, configs)
      .then((resp) => {
        setList(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Something went wrong!", error);
      });
  }, [type]);

  const toggleBtnHandler = (event, newValue) => {
    if (newValue) {
      setList([]);
      setType(newValue);
    }
  };

  return (
    <Paper className={classes.paperStyles}>
      {error && alert(error)}
      <Paper elevation={4} className={classes.headingStyles}>
        <Typography className={classes.pageHeading}>Explore</Typography>
        <ToggleButtonGroup exclusive value={type} onChange={toggleBtnHandler}>
          <ToggleButton value="devs">
            <Typography>Devs</Typography>
          </ToggleButton>
          <ToggleButton value="projects">
            <Typography>Projects</Typography>
          </ToggleButton>
          <ToggleButton value="companies">
            <Typography>Companies</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>
      <Grid
        container
        spacing={4}
        justify="center"
        xs={12}
        className={classes.mainContainer}
      >
        {loading && <Spinner />}
        {!loading && !!list.length && type === "devs" && (
          <Grid item justify="center" direction="row" container xs={12}>
            {list.map((dev, index) => (
              <Grid key={dev._id} item sm={6} md={3}>
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
        {!loading && list.length && type === "projects" && (
          <Grid
            item
            container
            spacing={4}
            direction="row"
            justify="center"
            xs={12}
          >
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
        )}
        {!loading && !!list.length && type === "companies" && (
          <Grid item justify="center" direction="row" container xs={12}>
            {list.map((company, index) => (
              <Grid key={company._id} item sm={6} md={3}>
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
