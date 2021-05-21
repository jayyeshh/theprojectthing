import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";

const ErrorPage = () => {
  return (
    <Grid
      item
      xs={12}
      container
      direction="column"
      alignItems="center"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#F3F3F3",
        flexWrap: "none",
        paddingTop: '4rem'
      }}
    >
      <Typography
        style={{
          fontWeight: 600,
          fontSize: "1.1rem",
        }}
      >
        Sorry this page isn't available.
      </Typography>
      <Typography>
        The link you followed may be broken, or the page may have been removed.
        <NavLink to={`/`}>Go back to home page.</NavLink>
      </Typography>
    </Grid>
  );
};

export default ErrorPage;
