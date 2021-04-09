import React, { useEffect, useState } from "react";
import { Paper, makeStyles, Grid } from "@material-ui/core";
import axios from "../utility/axios/apiInstance";
import Post from "../components/Post";
import Spinner from "./Spinner";
import PostBlock from "./PostBlock";

const useStyles = makeStyles({
  paperStyles: {
    width: "100%",
    padding: "2rem",
    overflow: "hidden",
    //   overflowY: "auto",
    //   "&::-webkit-scrollbar": {
    //     display: "none",
    //   },
    //   "&::scrollbar": {
    //     display: 'none'
    //   },
    //   scrollbarWidth: 'none'
  },
});

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
    <div className={classes.paperStyles}>
      {loading ? (
        <Grid
          xs={12}
          align="center"
          alignContent="center"
          style={{
            display: "flex",
            width: "100%",
            minHeigth: "100%",
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner />
        </Grid>
      ) : (
        <Grid
          style={{
            overflowY: "auto",
            paddingLeft: "2rem",
          }}
        >
          {props.authedAs.toLowerCase() === "company" && <PostBlock />}
          {posts.map((post, index) => {
            return (
              <Post
                post={post}
                updatePost={(updatedPost) => updatePost(index, updatedPost)}
              />
            );
          })}
        </Grid>
      )}
    </div>
  );
};

export default Home;
