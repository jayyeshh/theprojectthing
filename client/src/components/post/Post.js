import React from "react";
import { Grid, Avatar, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import GitHubIcon from "@material-ui/icons/GitHub";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  voteProject,
  getProjectById,
} from "../../utility/utilityFunctions/ApiCalls";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "70%",
    maxHeight: "30rem",
    border: ".1px solid #b1bdb4",
    borderRadius: "3px",
    margin: "2rem",
    background: "#fff",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      margin: "2rem 0",
      alignSelf: "center",
      justifyContent: "center",
    },
  },
  postHeader: {
    maxHeight: "4rem",
    height: "4rem",
    borderBottom: "1px solid grey",
    padding: "0 1rem",
  },
  linkStyles: {
    textDecoration: "none",
    color: "black",
    margin: "0 .4rem",
  },
  usernameStyles: {
    fontSize: "1.2rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1rem",
    },
  },
  postHeaderIdentity: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  footerStyles: {
    display: "flex",
    alignSelf: "flex-end",
    borderTop: "1px solid grey",
    height: "4rem",
    alignContent: "center",
    justifyContent: "space-between",
    padding: "0 1rem",
  },
  vote: {
    fontSize: "2.2rem",
  },
  voted: {
    color: "red",
  },
}));

const Post = ({ post, ...props }) => {
  const classes = useStyles();
  const vote = async (type) => {
    if (type) {
      //vote project
      voteProject({ pid: post._id, type })
        .then(async (_resp) => {
          //refresh data
          const updatedPost = await getProjectById(post._id);
          props.updatePost(updatedPost.data);
        })
        .catch((error) => {
          console.log(error);
          //showErrorModal
        });
    }
  };
  return (
    <Grid container direction="row" className={classes.container}>
      <Grid
        item
        xs={12}
        container
        direction="row"
        className={classes.postHeader}
        alignItems="center"
        alignContent="center"
        justify="space-between"
      >
        <Grid className={classes.postHeaderIdentity}>
          <Avatar aria-label={post.developer.username}>
            {post.developer.username.charAt(0).toUpperCase()}
          </Avatar>
          <NavLink
            to={{
              pathname: `/dev/${post.developer._id}`,
            }}
            className={classes.linkStyles}
          >
            <Typography className={classes.usernameStyles}>
              {post.developer.username.length < 10
                ? post.developer.username
                : post.developer.username.substr(0, 7) + "..."}
            </Typography>
          </NavLink>
        </Grid>
        <div>
          <Button
            onClick={() => window.open(post.links.github, "_blank")}
            disabled={!(post.links && !!post.links.github)}
          >
            <GitHubIcon />
          </Button>
          <Button
            onClick={() => window.open(post.links.site, "_blank")}
            disabled={!(post.links && !!post.links.site)}
          >
            view
          </Button>
        </div>
      </Grid>
      <Grid
        container
        item
        xs={12}
        style={{
          display: "flex",
          flex: 1,
          minWidth: "100%",
          maxHeight: "22rem",
        }}
      >
        {!!post.photos && post.photos.length ? (
          <img
            style={{ maxHeight: "100%" }}
            width="100%"
            src={post.photos[0]}
          />
        ) : (
          <Grid
            item
            container
            alignContent="center"
            alignItems="center"
            justify="center"
            style={{
              minHeight: "15rem",
              color: "#777",
            }}
          >
            <Typography>No Image Found</Typography>
          </Grid>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        container
        direction="row"
        className={classes.footerStyles}
      >
        <div>
          <Button
            disabled={
              !(props.isAuthenticated && props.as.toLowerCase() === "developer")
            }
            onClick={() => vote(1)}
          >
            <ExpandLessIcon
              className={
                post.upvoted ? `${classes.vote} ${classes.voted}` : classes.vote
              }
            />
            <Typography>{post.upvotes}</Typography>
          </Button>
          <Button
            disabled={
              !(props.isAuthenticated && props.as.toLowerCase() === "developer")
            }
            onClick={() => vote(-1)}
          >
            <ExpandMoreIcon
              className={
                post.downvoted
                  ? `${classes.vote} ${classes.voted}`
                  : classes.vote
              }
            />
            <Typography>{post.downvotes}</Typography>
          </Button>
        </div>
        <NavLink
          to={{
            pathname: `/projects/${post._id}`,
          }}
          className={classes.linkStyles}
          style={{
            alignSelf: "center",
          }}
        >
          <Typography>view project</Typography>
        </NavLink>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.authReducer.authenticated,
    as: state.authReducer.as,
  };
};

export default connect(mapStateToProps, null)(Post);
