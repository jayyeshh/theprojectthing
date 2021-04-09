import React from "react";
import { IconButton, Grid, Typography, Paper } from "@material-ui/core";
import ExposurePlus1OutlinedIcon from "@material-ui/icons/ExposurePlus1Outlined";

const CompanyPost = ({ post }) => {
  return (
    <Grid
      style={{
        display: "flex",
        flexDirection: "column",
        alignSelf: "center",
        alignItems: "flex-start",
        width: "50%",
        background: "#eee",
        margin: ".4rem",
        borderRadius: "2px",
        flex: 1,
      }}
    >
      <div style={{ textAlign: "left", padding: "1rem" }}>{post.text}</div>
      <Paper
        style={{
          display: "flex",
          flexDirection: "row",
          borderTop: "1px solid grey",
          maxHeight: "2rem",
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          margin: 0,
          padding: 0,
        }}
      >
        <IconButton color="primary" aria-label="interested">
          <ExposurePlus1OutlinedIcon style={{ fontSize: "1.3rem" }} />
        </IconButton>
        <Typography style={{fontSize: '.978rem'}}>{post.interested.length}</Typography>
      </Paper>
    </Grid>
  );
};

export default CompanyPost;
