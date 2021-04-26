import React, { useEffect, useState } from "react";
import { Paper, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "../utility/axios/apiInstance";
import Post from "../components/Post";
import Spinner from "./Spinner";
import PostBlock from "./PostBlock";

const useStyles = makeStyles((theme) => ({
  paperStyles: {
    maxWidth: "100%",
    padding: "2rem 0",
    overflow: "hidden",
    //   overflowY: "auto",
    //   "&::-webkit-scrollbar": {
    //     display: "none",
    //   },
    //   "&::scrollbar": {
    //     display: 'none'
    //   },
    //   scrollbarWidth: 'none'
    [theme.breakpoints.down("xs")]: {
      padding: 0,
    },
  },
  homeContainer: {
    width: "100%",
    overflowY: "auto",
    paddingLeft: "2rem",
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
      margin: 0,
    },
  },
}));

const Home = (props) => {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const updatePost = (index, updatedPost) => {
    const updatedPosts = [...posts];
    updatedPosts[index] = updatedPost;
    setPosts(updatedPosts);
  };

  useEffect(() => {
    const configs = {
      headers: {
        Authorization: localStorage.getItem("authToken"),
      },
    };
    axios
      .get("/home", configs)
      .then((resp) => {
        setLoading(false);
        setPosts(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        props.setModalState(
          true,
          "something went wrong! unable to fetch posts!"
        );
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
      });
  }, []);

  return (
    <Grid container className={classes.paperStyles}>
      {loading ? (
        <Grid
          item
          xs={12}
          container
          style={{ minHeight: "70vh" }}
          justify="center"
          alignItems="center"
          align="center"
          alignContent="center"
        >
          <Spinner />
        </Grid>
      ) : (
        <Grid className={classes.homeContainer} style={{ marginLeft: "1rem" }}>
          {props.authedAs.toLowerCase() === "company" && <PostBlock />}
          {props.authedAs.toLowerCase() === "developer" && posts.length === 0 && (
            <Grid
              container
              justify="center"
              alignItems="center"
              align="center"
              style={{
                minWidth: "100%",
                minHeight: "50vh",
              }}
            >
              <Typography>
                No posts to show. Go to explore section to view other
                developer's work.
              </Typography>
            </Grid>
          )}
          {posts.map((post, index) => {
            return (
              <Post
                key={post._id}
                post={post}
                updatePost={(updatedPost) => updatePost(index, updatedPost)}
              />
            );
          })}
        </Grid>
      )}
    </Grid>
  );
};

export default Home;
