import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "../../utility/axios/apiInstance";
import Post from "../post/Post";
import Spinner from "../spinners/Spinner";
import CreatePostDialog from "../post/CreatePostDialog";
import { PlusSquare } from "react-feather";

const useStyles = makeStyles((theme) => ({
  paperStyles: {
    maxWidth: "100%",
    paddingBottom: "4rem",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
      paddingBottom: "3rem",
    },
  },
  homeContainer: {
    width: "100%",
    overflowY: "auto",
    marginRight: "3rem",
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
      margin: 0,
      margin: "0 1rem",
    },
  },
  createPostContainer: {
    marginTop: "2rem",
    minHeight: "3rem",
    width: "70%",
    marginRight: "2rem",
    background: "white",
    "&:hover": {
      cursor: "pointer",
    },
    [theme.breakpoints.down("xs")]: {
      minWidth: "100%",
      marginRight: 0,
    },
  },
  createPostBtn: {
    minWidth: "95%",
    margin: ".1rem",
    padding: ".4rem",
    background: "#eee",
    transition: "all ease-in-out .3s",
    "&:hover": {
      background: "#ccc",
      color: "blue",
    },
  },
}));

const Home = (props) => {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createPost, setCreatePost] = useState(false);

  const updatePost = (index, updatedPost) => {
    const updatedPosts = [...posts];
    updatedPosts[index] = updatedPost;
    setPosts(updatedPosts);
  };

  const toggleCreatePost = () => {
    setCreatePost((prevState) => !prevState);
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
          style={{ minHeight: "100vh" }}
          justify="center"
          alignItems="center"
          align="center"
          alignContent="center"
        >
          <Spinner />
        </Grid>
      ) : (
        <Grid
          container
          direction="column"
          alignItems="flex-end"
          className={classes.homeContainer}
        >
          {props.authedAs.toLowerCase() === "company" && createPost && (
            <CreatePostDialog open={createPost} close={toggleCreatePost} />
          )}
          {props.authedAs.toLowerCase() === "company" && (
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              className={classes.createPostContainer}
              onClick={toggleCreatePost}
            >
              <Grid
                container
                justify="center"
                className={classes.createPostBtn}
              >
                <PlusSquare />
                <Typography
                  style={{
                    marginLeft: ".4rem",
                  }}
                >
                  Create post
                </Typography>
              </Grid>
            </Grid>
          )}
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
