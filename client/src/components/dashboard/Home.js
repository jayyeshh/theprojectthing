import React, { useEffect, useState, useRef } from "react";
import { Grid, Typography, CircularProgress } from "@material-ui/core";
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
    [theme.breakpoints.down("xs")]: {
      margin: 0,
      margin: "0 1rem",
      padding: 0,
      alignItems: "flex-start",
    },
  },
  createPostContainer: {
    marginTop: "2rem",
    minHeight: "3rem",
    width: "70%",
    marginLeft: "8rem",
    background: "white",
    "&:hover": {
      cursor: "pointer",
    },
    [theme.breakpoints.down("xs")]: {
      minWidth: "100%",
      marginLeft: 0,
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
  const [prevY, setPrevY] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const [load, setLoad] = useState(false);
  const [observer, setObserver] = useState(null);
  const [seenAll, setSeenAll] = useState(false);
  const loadingRef = useRef();

  function buildThresholdList() {
    let thresholds = [];
    let numSteps = 180;

    for (let i = 1.0; i <= numSteps; i++) {
      let ratio = i / numSteps;
      thresholds.push(ratio);
    }

    thresholds.push(0);
    return thresholds;
  }

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: buildThresholdList(),
  };

  const handleObserver = (entities, observer) => {
    const y = entities[0].boundingClientRect.y;
    if (window) {
      if (y + window.scrollY <= 100) {
        setLoad(true);
      }
    }
  };

  const updatePost = (index, updatedPost) => {
    const updatedPosts = [...posts];
    updatedPosts[index] = updatedPost;
    setPosts(updatedPosts);
  };

  const toggleCreatePost = () => {
    setCreatePost((prevState) => !prevState);
  };

  useEffect(() => {
    if (seenAll) return;
    setLoad(false);
    if (loadMore) return;
    setLoadMore(true);
    const configs = {
      headers: {
        Authorization: localStorage.getItem("authToken"),
      },
    };
    axios
      .get(`/home/?skip=${posts.length}&limit=2`, configs)
      .then((resp) => {
        setLoading(false);
        if (resp.data.length === 0) {
          setSeenAll(true);
        } else {
          setPosts((prev) => prev.concat(resp.data));
        }
        setTimeout(() => {
          setLoadMore(false);
        }, 1000);
        setLoad(false);
      })
      .catch((error) => {
        setLoading(false);
        props.setModalState(
          true,
          "something went wrong! unable to fetch posts!",
          "error"
        );
        setLoad(false);
        setTimeout(() => {
          setLoadMore(false);
        }, 1000);
      });

    const observerr = new IntersectionObserver(handleObserver, options);
    setObserver(observerr);
  }, [load]);

  useEffect(() => {
    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }
  }, [loadingRef && loadingRef.current]);

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
          alignItems="center"
          className={classes.homeContainer}
          ref={loadingRef}
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
              style={{
                marginRight: "8rem",
              }}
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
          <Grid
            container
            direction="column"
            alignItems="center"
            style={{
              flexWrap: "nowrap",
              overflow: "hidden",
            }}
          >
            {posts.map((post, index) => {
              return (
                <Post
                  key={post._id}
                  post={post}
                  updatePost={(updatedPost) => updatePost(index, updatedPost)}
                />
              );
            })}
            {loadMore && (
              <Grid
                container
                justify="center"
                style={{
                  marginTop: "2rem",
                }}
              >
                <CircularProgress color="secondary" />
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default Home;
