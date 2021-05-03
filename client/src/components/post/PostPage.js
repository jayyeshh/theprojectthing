import React, { useState, useEffect } from "react";
import {
  Avatar,
  Divider,
  IconButton,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import ExposureNeg1Icon from "@material-ui/icons/ExposureNeg1";
import ExposurePlus1OutlinedIcon from "@material-ui/icons/ExposurePlus1Outlined";
import moment from "moment";
import axios from "../../utility/axios/apiInstance";
import { NavLink, useHistory } from "react-router-dom";
import Spinner from "../spinners/Spinner";
import { makeStyles } from "@material-ui/core/styles";
import { getPostById } from "../../utility/utilityFunctions/ApiCalls";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    padding: "4rem 0",
    background: "#1F4980",
    minHeight: "100vh",
    width: "100%",
    border: "1px solid black",
    padding: "2rem",
    [theme.breakpoints.down("xs")]: {
      padding: "2rem 0",
      width: "100%",
    },
  },
  profileContainer: {
    padding: "1rem",
  },
  postBlock: {
    padding: "1rem",
    background: "white",
    height: "100%",
  },
  postTitle: {
    fontFamily: "Nono Sans JP",
    fontWeight: 600,
    fontSize: "1.5rem",
    margin: ".4rem 0",
  },
  date: {
    color: "#888",
    fontFamily: "Roboto",
    fontWeight: 600,
  },
  postBody: {
    color: "#333",
  },
  profile: {
    marginLeft: "1rem",
  },
  profileSection: {
    marginBottom: "1rem",
    background: "white",
    border: "1px solid white",
    borderRadius: "2px",
  },
  link: {
    textDecoration: "none",
  },
  btnStyles: {
    margin: ".8rem 0 .2rem 0",
  },
  profileDetails: {
    margin: ".5rem 0",
  },
  listBlock: {
    background: "white",
    padding: ".7rem",
  },
  profileTop: {
    background: "#373C3F",
    minHeight: "1.5rem",
  },
  label: {
    fontWeight: 600,
    marginTop: ".4rem",
  },
  rowGrid: {},
  boldTitle: {
    fontSize: "1.2rem",
    color: "#444",
    textTransform: "capitalize",
    fontWeight: 600,
    fontFamily: "Nono Sans JP",
    marginLeft: ".6rem",
    "&:hover": {
      color: "blue",
    },
  },
  blockTitle: {
    fontWeight: 600,
    fontSize: "1.3rem",
  },
  developerBlock: {
    borderBottom: "1px solid gray",
    padding: ".4rem 0",
    "&:hover": {
      background: "#eee",
    },
  },
}));

const PostPage = (props) => {
  console.log(props);
  const classes = useStyles();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [authedDevInteresed, setAuthedDevInterested] = useState(false);
  const history = useHistory();

  const setupPost = async () => {
    getPostById(props.match.params.id)
      .then((resp) => {
        setPost(resp.data);
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

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  useEffect(async () => {
    await setupPost();
  }, [post]);

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

  const markInterested = () => {
    const configs = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    axios
      .post("/post/interested/", { postId: post._id }, configs)
      .then(async (resp) => {
        await setupPost();
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  return (
    <Grid
      container
      direction="row"
      justify="center"
      className={classes.mainContainer}
    >
      <Grid item xs={8} className={classes.postBlock}>
        <Typography className={classes.postTitle}>{post.title}</Typography>
        <Typography className={classes.date}>
          {new moment(post.createdAt).format("YYYY, MMM DD")}
        </Typography>

        <Typography className={classes.postBody}>{post.body}</Typography>
        <Divider
          orientation="horizontal"
          variant="fullWidth"
          style={{
            margin: ".6rem 0",
          }}
        />
        <Grid container direction="column" justify="center">
          <Grid
            container
            direction="row"
            alignItems="center"
            style={{
              height: "3rem",
            }}
          >
            <Typography className={classes.label}>Interested</Typography>
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
          </Grid>

          {post.interested.length === 1 ? (
            <Typography>{post.interested.length} developer</Typography>
          ) : (
            <Typography>{post.interested.length} developers</Typography>
          )}
        </Grid>
      </Grid>
      <Grid
        item
        xs={3}
        container
        direction="column"
        className={classes.profile}
      >
        <Grid container direction="column" className={classes.profileSection}>
          <Grid container className={classes.profileTop}></Grid>
          <Grid
            container
            direction="column"
            className={classes.profileContainer}
          >
            <Grid container direction="row" className={classes.rowGrid}>
              <Avatar />
              <NavLink
                to={`/company/${post.author._id}`}
                className={classes.link}
              >
                <Typography className={classes.boldTitle}>
                  {post.author.name}
                </Typography>
              </NavLink>
            </Grid>
            <Grid
              container
              direction="column"
              className={classes.profileDetails}
            >
              <Typography>{post.author.about}</Typography>
              <Typography className={classes.label}>Email: </Typography>
              <Typography>{post.author.email}</Typography>
              <Typography className={classes.label}>Joined:</Typography>
              <Typography>
                {new moment(post.author.createdAt).format("YYYY, MMM DD")}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                className={classes.btnStyles}
                onClick={() => {
                  history.push(`/company/${post.author._id}`);
                }}
              >
                View Profile
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container direction="column" className={classes.listBlock}>
          <Typography className={classes.blockTitle}>
            Interested Developers
          </Typography>
          {post.interested.map((developer) => {
            return (
              <Grid
                container
                direction="row"
                className={classes.developerBlock}
              >
                <Grid item xs={2} className={classes.avatar}>
                  <Avatar>{developer.username[0].toUpperCase()}</Avatar>
                </Grid>
                <Grid item xs={10} container direction="column">
                  <NavLink
                    to={`/dev/${developer._id}`}
                    className={classes.link}
                  >
                    <Typography
                      className={classes.label}
                      style={{
                        color: "black",
                      }}
                    >
                      {developer.name}
                    </Typography>
                  </NavLink>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    authedAs: state.authReducer.as,
    uid: state.authReducer.user._id,
  };
};

export default connect(mapStateToProps, null)(PostPage);
