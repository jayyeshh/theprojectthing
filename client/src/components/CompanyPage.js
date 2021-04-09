import { Avatar, Grid, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { getCompanyById } from "../utility/utilityFunctions/ApiCalls";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import Spinner from "./Spinner";
import CompanyPost from "./CompanyPost";

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

const CompanyPage = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState({});
  const [currLocation, setCurrLocation] = useState("");
  const [error, setError] = useState("");

  if (props.history.location.pathname !== currLocation) {
    setLoading(true);
    setCurrLocation(props.history.location.pathname);
  }

  useEffect(() => {
    getCompanyById(props.match.params.id)
      .then((resp) => {
        setCompany(resp.data);
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
      {!!Object.keys(company).length && (
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
                {company.name.charAt(0)}
              </Avatar>
              <Typography color="textSecondary" style={{ margin: ".1rem 0" }}>
                @{company.username}
              </Typography>
              <Typography>{company.name}</Typography>
              <div
                style={{
                  margin: ".7rem 0",
                }}
              >
                <Typography>Email:</Typography>
                <Typography> {company.email}</Typography>
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
              Posts
            </Typography>
            <Grid
              container
              item
              direction="column"
              xs={12}
              style={{
                margin: "1rem 0",
              }}
            >
              {!!company.posts.length ? (
                company.posts.map((post) => {
                  return <CompanyPost post={post} />;
                })
              ) : (
                <Typography style={{fontWeight: 400, fontSize: '1.4rem'}}>No Posts Yet</Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default CompanyPage;
