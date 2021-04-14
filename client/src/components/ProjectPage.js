import React, { useState, useEffect } from "react";
import axios from "../utility/axios/apiInstance";
import GitHubIcon from "@material-ui/icons/GitHub";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Spinner from "./Spinner";
import moment from "moment";
import {
  Grid,
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Avatar,
  Hidden,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SideProfile from "./SideProfile";
import { connect } from "react-redux";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import EditIcon from "@material-ui/icons/Edit";
import {
  voteProject,
  getProjectById,
} from "../utility/utilityFunctions/ApiCalls";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  containerStyles: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  projectContainer: {
    margin: "2rem",
    [theme.breakpoints.down("xs")]: {
      margin: "0",
      marginTop: "2rem",
    },
  },
  img: {
    height: "22rem",
    padding: "2rem 0",
  },
  blockHeading: {
    margin: "1rem",
    textDecoration: "underline",
  },
  vote: {
    fontSize: "2.2rem",
  },
  voted: {
    color: "red",
  },
  expandTagStyles: {
    marginLeft: "1rem",
    transition: "all .1s ease-in-out",
    "&:hover": {
      color: "grey",
      cursor: "pointer",
    },
  },
  avatar: {
    fontSize: "1rem",
  },
  commentStyle: {
    margin: ".6rem 0",
  },
  buttonProgress: {
    padding: "0rem 1.5rem",
  },
}));

const ProjectPage = (props) => {
  const [currLocation, setCurrLocation] = useState("");
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [focused, setFocused] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [editingComment, setEditingComment] = useState("");
  const [editingCommentText, setEditingCommentText] = useState("");
  const [updatingComment, setUpdatingComment] = useState(false);
  if (props.history.location.pathname !== currLocation) {
    setLoading(true);
    setCurrLocation(props.history.location.pathname);
  }

  const defaultImage =
    "https://safetyaustraliagroup.com.au/wp-content/uploads/2019/05/image-not-found.png";

  useEffect(() => {
    const config = {};
    if (props.isAuthenticated && props.as.toLowerCase() === "developer") {
      config.headers = {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      };
    }
    axios
      .get(`/project/${props.match.params.id}`, config)
      .then((resp) => {
        setProject(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        setTimeout(() => {
          setError("");
        }, 2000);
      });
  }, [currLocation]);
  const classes = useStyles();
  const vote = async (type) => {
    if (type) {
      //vote project
      voteProject({ pid: project._id, type })
        .then(async (_resp) => {
          //refresh data
          const updatedProject = await getProjectById(project._id);
          setProject(updatedProject.data);
        })
        .catch((error) => {
          setError("Something went wrong! cannot register vote for now!");
          setTimeout(() => {
            setError("");
          }, 2000);
        });
    }
  };

  const postComment = () => {
    setPostingComment(true);
    const configs = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    const payload = {
      text: commentText,
      projectId: project._id,
    };
    axios
      .post("/comment", payload, configs)
      .then((resp) => {
        setPostingComment(false);
        setProject({
          ...project,
          comments: [...project.comments, resp.data.comment],
        });
        setCommentText("");
      })
      .catch((error) => {
        setPostingComment(false);
        console.log("error: ", error, error.response);
      });
  };

  const cancelComment = () => {
    setFocused(false);
    setCommentText("");
  };

  const setUpdatingStates = (index) => {
    setEditingComment(project.comments[index]._id);
    setEditingCommentText(project.comments[index].text);
  };

  const cancelCommentEditing = () => {
    setEditingComment("");
    setEditingCommentText("");
  };

  const updateComment = () => {
    setUpdatingComment(true);
    axios.patch(`/comment/${editingComment}`).then(resp=>{

    }).catch(error=>{

    })
  };

  return (
    <Grid
      container
      item
      xs={12}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      {error && <h4 style={{ color: "red" }}>{error}</h4>}
      {loading ? (
        <Container className={classes.containerStyles}>
          <Spinner />
        </Container>
      ) : (
        <Grid
          item
          direction="row"
          style={{
            height: "100%",
            overflow: "auto",
            paddingLeft: "2rem",
          }}
          xs={12}
          spacing={2}
          container
        >
          <Grid
            container
            item
            xs={12}
            sm={8}
            direction="column"
            className={classes.projectContainer}
          >
            <Grid
              container
              item
              xs={12}
              direction="row"
              justify="space-between"
            >
              <Typography component="h1" variant="h4">
                {project.title}
              </Typography>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Button
                  onClick={() => window.open(project.links.github, "_blank")}
                  disabled={!(project.links && !!project.links.github)}
                >
                  <GitHubIcon />
                </Button>
                <Button
                  onClick={() => window.open(project.links.site, "_blank")}
                  disabled={!(project.links && !!project.links.site)}
                >
                  view
                </Button>
                {project.developer &&
                  props.isAuthenticated &&
                  project.developer.username ===
                    props.authenticatedUser.username && (
                    <NavLink
                      to={{
                        pathname: `/projects/edit/${project._id}`,
                        state: {
                          project,
                        },
                      }}
                      style={{
                        color: "black",
                        textDecoration: "none",
                        marginLeft: ".8rem",
                      }}
                    >
                      <EditOutlinedIcon />
                    </NavLink>
                  )}
              </div>
            </Grid>
            <img
              src={!!project.photo ? project.photo : defaultImage}
              width="100%"
              className={classes.img}
            />
            <Grid item xs={12}>
              <Button
                disabled={
                  !(
                    props.isAuthenticated &&
                    props.as.toLowerCase() === "developer"
                  )
                }
                onClick={() => vote(1)}
              >
                <ExpandLessIcon
                  className={
                    project.upvoted
                      ? `${classes.vote} ${classes.voted}`
                      : classes.vote
                  }
                />
                <Typography>{project.upvotes}</Typography>
              </Button>
              <Button
                disabled={
                  !(
                    props.isAuthenticated &&
                    props.as.toLowerCase() === "developer"
                  )
                }
                onClick={() => vote(-1)}
              >
                <ExpandMoreIcon
                  className={
                    project.downvoted
                      ? `${classes.vote} ${classes.voted}`
                      : classes.vote
                  }
                />
                <Typography>{project.downvotes}</Typography>
              </Button>
            </Grid>
            <Divider style={{ marginBottom: ".7rem" }} />
            {!!project.about && (
              <Grid>
                <Typography component="h1" variant="h6" display="inline">
                  Description:
                </Typography>
                <Typography
                  paragraph
                  style={{ transition: "all 1s ease-in-out" }}
                >
                  {project.about.length < 80 || expanded ? (
                    <Grid container direction="row">
                      <Typography>{project.about}</Typography>
                      {expanded && (
                        <Typography
                          className={classes.expandTagStyles}
                          style={{ margin: 0 }}
                          onClick={() => setExpanded(!expanded)}
                        >
                          show less
                        </Typography>
                      )}
                    </Grid>
                  ) : (
                    <Grid container direction="row">
                      <Typography>
                        {project.about.substr(0, 77) + "..."}
                      </Typography>
                      <Typography
                        className={classes.expandTagStyles}
                        onClick={() => setExpanded(!expanded)}
                      >
                        see more
                      </Typography>
                    </Grid>
                  )}
                </Typography>
                <Divider style={{ marginBottom: ".7rem" }} />
              </Grid>
            )}
            <Grid container direction="column">
              <Grid>
                <Typography style={{ fontWeight: 800 }}>
                  {project.comments.length}{" "}
                  {project.comments.length === 1 ? "Comment" : "Comments"}
                </Typography>
              </Grid>
              <Grid>
                <TextField
                  id="standard-basic"
                  value={commentText}
                  onFocus={() => setFocused(true)}
                  placeholder="add a comment..."
                  style={{
                    margin: "1rem 0",
                    width: "100%",
                  }}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </Grid>
              {focused && (
                <Grid container direction="row" justify="flex-end">
                  <Button variant="contained" onClick={() => cancelComment()}>
                    CANCEL
                  </Button>
                  <Button
                    disabled={!!!commentText || postingComment}
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: ".7rem" }}
                    onClick={() => postComment()}
                  >
                    {postingComment ? (
                      <CircularProgress
                        size={14}
                        className={classes.buttonProgress}
                      />
                    ) : (
                      "COMMENT"
                    )}
                  </Button>
                </Grid>
              )}
              <Grid container direction="row">
                {project.comments.map((comment, index) => {
                  if (editingComment.toString() === comment._id.toString()) {
                    return (
                      <Grid
                        key={comment._id}
                        item
                        xs={9}
                        container
                        direction="column"
                        className={classes.commentStyle}
                        style={{
                          border: "1px solid black",
                        }}
                      >
                        <Grid item xs={12} container direction="row">
                          <Avatar
                            aria-label={comment.by.username}
                            className={classes.avatar}
                          >
                            {comment.by.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <TextField
                            focused
                            id="editable-comment"
                            value={editingCommentText}
                            multiline
                            onFocus={() => setFocused(true)}
                            placeholder="add a comment..."
                            onChange={(e) =>
                              setEditingCommentText(e.target.value)
                            }
                            style={{
                              margin: "1rem 0",
                              display: "flex",
                              flex: 1,
                              marginLeft: "1rem",
                            }}
                          />
                        </Grid>
                        <Grid container direction="row" justify="flex-end">
                          <Button
                            variant="contained"
                            onClick={() => cancelCommentEditing()}
                          >
                            CANCEL
                          </Button>
                          <Button
                            disabled={!!!editingCommentText || updatingComment}
                            variant="contained"
                            color="primary"
                            style={{ marginLeft: ".7rem" }}
                            onClick={() => updateComment()}
                          >
                            {updatingComment ? (
                              <CircularProgress
                                size={14}
                                className={classes.buttonProgress}
                              />
                            ) : (
                              "UPDATE"
                            )}
                          </Button>
                        </Grid>
                      </Grid>
                    );
                  } else {
                    return (
                      <Grid
                        key={comment._id}
                        container
                        direction="row"
                        className={classes.commentStyle}
                      >
                        <Avatar
                          aria-label={comment.by.username}
                          className={classes.avatar}
                        >
                          {comment.by.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Grid
                          item
                          xs={8}
                          container
                          direction="column"
                          style={{
                            marginLeft: "1rem",
                          }}
                        >
                          <Grid
                            container
                            direction="row"
                            justify="space-between"
                            style={{ border: "1px solid black", width: "100%" }}
                          >
                            <Grid
                              item
                              xs={8}
                              container
                              direction="row"
                              align="center"
                              alignItems="center"
                            >
                              <NavLink
                                to={
                                  comment.onModel === "Developer"
                                    ? `/dev/${comment.by._id}`
                                    : `/company/${comment.by._id}`
                                }
                                style={{
                                  color: "black",
                                  textDecoration: "none",
                                }}
                              >
                                <Typography>
                                  <b>{comment.by.name}</b>
                                </Typography>
                              </NavLink>
                              <Typography
                                color="textSecondary"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  fontSize: ".9rem",
                                  marginLeft: ".3rem",
                                }}
                              >
                                {new moment(comment.createdAt).fromNow()}
                              </Typography>
                            </Grid>
                            {comment.by._id.toString() ===
                              props.authenticatedUser._id && (
                              <IconButton
                                aria-label="delete"
                                onClick={() => setUpdatingStates(index)}
                              >
                                <Tooltip title="edit">
                                  <EditIcon fontSize="small" />
                                </Tooltip>
                              </IconButton>
                            )}
                          </Grid>
                          <Typography>{comment.text}</Typography>
                        </Grid>
                      </Grid>
                    );
                  }
                })}
              </Grid>
            </Grid>
          </Grid>
          <Hidden xsDown>
            <Grid
              item
              xs={3}
              style={{
                height: "100%",
                width: "100%",
                position: "fixed",
                right: "1rem",
                marginRight: "1rem",
                padding: "2rem",
              }}
            >
              <Typography
                align="center"
                component="h1"
                variant="h5"
                className={classes.blockHeading}
              >
                Developer
              </Typography>
              {project.developer && (
                <SideProfile
                  as="developer"
                  user={project.developer}
                  projects={project.developer.projects}
                />
              )}
            </Grid>
          </Hidden>
        </Grid>
      )}
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.authReducer.authenticated,
    as: state.authReducer.as,
    authenticatedUser: state.authReducer.user,
  };
};

export default connect(mapStateToProps, null)(ProjectPage);
