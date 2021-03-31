import React from "react";
import Header from "./Header";
import { Grid } from "@material-ui/core";
import Dashboard from "./Dashboard";

const FrontPage = () => {
  return (
    <Grid container direction="column">
      <Grid item>
        <Header />
      </Grid>
      <Grid item container>
        <Dashboard />
      </Grid>
    </Grid>
  );
};

export default FrontPage;
