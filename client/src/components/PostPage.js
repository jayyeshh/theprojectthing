import React, { useState, useEffect } from "react";
import { getPostById } from "../utility/utilityFunctions/ApiCalls";
import { Grid, Typography } from "@material-ui/core";
import moment from "moment";
import { NavLink } from "react-router-dom";
import Spinner from "./Spinner";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    padding: "4rem 0",
    [theme.breakpoints.down("xs")]: {
      padding: "2rem 0",
      width: "100%",
    },
  },
  subContainer: {
    padding: "0 4rem",
    [theme.breakpoints.down("xs")]: {
      padding: "0 1rem",
    },
  },
  postText: {
    padding: "1.4rem .8rem",
    backgroundColor: "#eee",
    margin: ".8rem 0",
    borderRadius: "2px",
  },
  devList: {
    overflowX: "hidden",
    overflowY: "auto",
    [theme.breakpoints.down("xs")]: {
      padding: "0 1rem",
    },
  },
}));

const PostPage = (props) => {
  const classes = useStyles();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getPostById(props.match.params.id)
      .then((resp) => {
        setPost(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Grid
        container
        align="center"
        alignContent="center"
        justify="center"
        alignItems="center"
        style={{
          minHeight: "70vh",
          minWidth: "100vw",
        }}
      >
        <Spinner />
      </Grid>
    );
  }

  return (
    <Grid container direction="row" className={classes.mainContainer}>
      <Grid
        item
        container
        xs={12}
        sm={8}
        direction="column"
        align="center"
        justify="center"
        className={classes.subContainer}
      >
        <Grid item xs={12} container justify="space-between">
          <Typography>
            Posted by:{" "}
            <NavLink
              to={`/company/${post.author._id}`}
              style={{ textDecoration: "none" }}
            >
              <b>{post.author.username}</b>
            </NavLink>
          </Typography>
          <Typography>
            on:{" "}
            <b>{new moment(post.createdAt).format("ddd,DD MMM (HH:mm a)")}</b>
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          container
          direction="row"
          className={classes.postText}
        >
          {post.text}
        </Grid>
      </Grid>
      <Grid
        container
        item
        sm={4}
        xs={12}
        direction="column"
        className={classes.devList}
      >
        <Grid>
          <Typography variant="h5">Interested Developers</Typography>
        </Grid>
        <Grid>
          {post.interested.map((dev) => {
            return (
              <Grid key={dev._id}>
                <NavLink
                  to={`/dev/${dev._id}`}
                  style={{ textDecoration: "none", color: "grey" }}
                >
                  <Typography variant="h6">@{dev.username}</Typography>
                </NavLink>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PostPage;
