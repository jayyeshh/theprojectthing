import { Avatar, Grid, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { getDeveloperById } from "../utility/utilityFunctions/ApiCalls";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import Spinner from "./Spinner";
import ExpandableProjectCard from "./ExpandableProjectCard";

const useStyles = makeStyles((theme) => ({
  containerStyles: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  profile: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeigth: "100%",
    background: "white",
    padding: "4rem",
    overflow: "hidden",
    position: "sticky",
  },
  labelStyle: {
    fontWeight: "400",
    marginRight: ".3rem",
  },
}));

const DevPage = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [developer, setDeveloper] = useState({});
  const [currLocation, setCurrLocation] = useState("");
  const [error, setError] = useState("");

  if (props.history.location.pathname !== currLocation) {
    setLoading(true);
    setCurrLocation(props.history.location.pathname);
  }

  useEffect(() => {
    getDeveloperById(props.match.params.id)
      .then((resp) => {
        setDeveloper(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  return (
    <Grid container>
      {error && <h4 style={{ color: "red" }}>{error}</h4>}
      {loading && (
        <Container className={classes.containerStyles}>
          <Spinner />
        </Container>
      )}
      {!!Object.keys(developer).length && (
        <Grid container item xs={12}>
          <Grid item xs={4} className={classes.profile}>
            <div
              style={{
                position: "fixed",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Avatar style={{ fontSize: "1.4rem", margin: ".3rem" }}>
                {developer.name.charAt(0)}
              </Avatar>
              <Typography color="textSecondary" style={{ margin: ".1rem 0" }}>
                @{developer.username}
              </Typography>
              <Typography>{developer.name}</Typography>
              <div
                style={{
                  margin: ".7rem 0",
                }}
              >
                <Typography>Email:</Typography>
                <Typography> {developer.email}</Typography>
              </div>
              <div
                style={{
                  margin: ".7rem 0",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Typography className={classes.labelStyle}>
                  Followers:
                </Typography>
                <Typography> {developer.followers.length}</Typography>
              </div>
              <div
                style={{
                  margin: ".7rem 0",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Typography className={classes.labelStyle}>
                  Following:
                </Typography>
                <Typography> {developer.following.length}</Typography>
              </div>
            </div>
          </Grid>
          <Grid
            container
            item
            align="center"
            direction="column"
            xs={8}
            style={{
              padding: "2rem 0",
            }}
          >
            <Typography
              component="h2"
              variant="h5"
              style={{ textDecoration: "underline" }}
            >
              Projects
            </Typography>
            <Grid container item direction="row" xs={12}>
              {!!developer.projects &&
                developer.projects.map((project) => {
                  return (
                    <Grid
                      item
                      xs={5}
                      style={{
                        margin: "1rem",
                      }}
                    >
                      <ExpandableProjectCard project={project} />
                    </Grid>
                  );
                })}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default DevPage;
