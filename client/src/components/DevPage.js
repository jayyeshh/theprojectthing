import { Grid } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { getDeveloperById } from "../utility/utilityFunctions/ApiCalls";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import Spinner from "./Spinner";

const useStyles = makeStyles({
  containerStyles: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
});

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
        setLoading(false);
        setDeveloper(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error:", error);
      });
  }, [currLocation]);

  return (
    <Grid
      container
      style={{
        height: "100%",
        width: "100%",
        padding: "1rem",
      }}
    >
      {error && <h4 style={{ color: "red" }}>{error}</h4>}
      {loading ? (
        <Container className={classes.containerStyles}>
          <Spinner />
        </Container>
      ) : (
        <Grid container item={12}>
          {developer.name}
        </Grid>
      )}
    </Grid>
  );
};

export default DevPage;
