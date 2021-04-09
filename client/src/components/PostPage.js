import React, { useState, useEffect } from "react";
import { getPostById } from "../utility/utilityFunctions/ApiCalls";
import { Grid } from "@material-ui/core";

const PostPage = (props) => {
  const [post, setPost] = useState({});
  useEffect(() => {
    getPostById(props.match.params.id)
      .then((resp) => {
        setPost(resp.data);
      })
      .catch((error) => console.log("error: ", error));
  }, []);
  return (
    <Grid container direction="column">
      <Grid
        item
        container
        xs={8}
        align="center"
        justify="center"
        style={{
          marginTop: "3rem",
        }}
      >
        <Grid item style={{ 
            padding: '2rem',
            backgroundColor: "#eee" }}>
          {post.text}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PostPage;
