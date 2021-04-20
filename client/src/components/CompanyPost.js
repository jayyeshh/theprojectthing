import React, { useEffect, useState } from "react";
import { IconButton, Grid, Typography, Paper } from "@material-ui/core";
import ExposureNeg1Icon from "@material-ui/icons/ExposureNeg1";
import ExposurePlus1OutlinedIcon from "@material-ui/icons/ExposurePlus1Outlined";
import { connect } from "react-redux";
import axios from "../utility/axios/apiInstance";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  listviewerBtn: {
    fontSize: ".978rem",
    "&:hover": {
      cursor: "pointer",
      color: "#616151",
    },
  },
  mainPostContainer: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    alignItems: "flex-start",
    width: "50%",
    background: "#eee",
    margin: ".4rem",
    borderRadius: "2px",
    flex: 1,
    [theme.breakpoints.down("xs")]: {
      width: "75%",
    },
  },
}));

const CompanyPost = ({ post, ...props }) => {
  const classes = useStyles();
  const [authedDevInteresed, setAuthedDevInterested] = useState(false);
  useEffect(() => {
    let checkState = false;
    if (props.authedAs) {
      checkState = post.interested.some((item) => {
        if (typeof item === "string") {
          return item.toString() === props.uid.toString();
        } else if (typeof item === "object" && item !== null) {
          return item._id.toString() === props.uid.toString();
        }
      });
      setAuthedDevInterested(checkState);
    } else {
      setAuthedDevInterested(checkState);
    }
  }, [post, post.interested.length]);
  const markInterested = () => {
    const configs = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    axios
      .post("/post/interested/", { postId: post._id }, configs)
      .then((resp) => {
        props.updatePost(resp.data.post);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  return (
    <Grid className={classes.mainPostContainer}>
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
        <IconButton
          disabled={
            !props.authedAs || props.authedAs.toLowerCase() !== "developer"
          }
          color={authedDevInteresed ? "secondary" : "primary"}
          aria-label="interested"
          onClick={() => markInterested()}
        >
          {authedDevInteresed ? (
            <ExposureNeg1Icon style={{ fontSize: "1.3rem" }} />
          ) : (
            <ExposurePlus1OutlinedIcon style={{ fontSize: "1.3rem" }} />
          )}
        </IconButton>
        <Typography
          onClick={() => props.handleShowInterestedDevs(props.index)}
          className={classes.listviewerBtn}
        >
          {post.interested.length}
        </Typography>
      </Paper>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    authedAs: state.authReducer.as,
    uid: state.authReducer.user._id,
  };
};

export default connect(mapStateToProps, null)(CompanyPost);
