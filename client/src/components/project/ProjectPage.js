import React, { useState, useEffect } from "react";
import axios from "../../utility/axios/apiInstance";
import GitHubIcon from "@material-ui/icons/GitHub";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import { setModalStateAction } from "../../actions/modalActions";
import Spinner from "../spinners/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal } from "@fortawesome/free-solid-svg-icons";
import "react-image-gallery/styles/css/image-gallery.css";
import NavigateBeforeSharpIcon from "@material-ui/icons/NavigateBeforeSharp";
import NavigateNextSharpIcon from "@material-ui/icons/NavigateNextSharp";
import _ from "lodash";
import moment from "moment";
import {
  Grid,
  Chip,
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
import { connect } from "react-redux";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import ListModal from "../modals/ListModal";
import EditIcon from "@material-ui/icons/Edit";
import {
  voteProject,
  getProjectById,
  rewardProject,
  getProjects,
} from "../../utility/utilityFunctions/ApiCalls";
import { NavLink, useHistory } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import SideSuggestionBlock from "../shared/SideSuggestionBlock";

const useStyles = makeStyles((theme) => ({
  masterContainer: {
    backgroundColor: "#DAE0E6",
  },
  containerStyles: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  mainContainer: {
    height: "100%",
    overflow: "auto",
    paddingLeft: "2rem",
    [theme.breakpoints.down("xs")]: {
      padding: ".2rem",
    },
  },
  projectContainer: {
    margin: "1rem",
    flexWrap: "nowrap",
    [theme.breakpoints.down("xs")]: {
      margin: "0",
      marginTop: "1rem",
    },
  },
  img: {
    maxHeight: "22rem",
    padding: "1rem 0",
  },
  cover: {
    objectFit: "cover",
    width: "100%",
    height: "100%",
    maxHeight: "24rem",
    padding: "1rem 0",
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
  reward: {
    marginRight: ".4rem",
  },
  rewarded: {
    color: "blue",
  },
  link: {
    textDecoration: "none",
    "&:hover": {
      cursor: "pointer",
    },
  },
  expandTagStyles: {
    marginLeft: "1rem",
    transition: "all .1s ease-in-out",
    "&:hover": {
      color: "grey",
      cursor: "pointer",
    },
    [theme.breakpoints.down("xs")]: {
      margin: 0,
    },
  },
  sideProjectBlock: {
    minHeight: "7rem",
    minWidth: "22rem",
    margin: ".4rem 0",
    padding: ".2rem",
    paddingLeft: ".6rem",
    boxShadow: "1px 1px 10px gray",
    transition: "all ease-in-out .1s",
    "&:hover": {
      cursor: "pointer",
      boxShadow: "1px 4px 14px gray",
      transform: "scale(1.02)",
    },
  },
  avatar: {
    fontSize: "1rem",
  },
  commentStyle: {
    margin: ".6rem 0",
    overflow: "wrap",
  },
  buttonProgress: {
    padding: "0rem 1.5rem",
  },
  timeTypeStyles: {
    display: "flex",
    alignItems: "center",
    fontSize: ".9rem",
    marginLeft: ".3rem",
    [theme.breakpoints.down("xs")]: {},
  },
  rewardBtnStyles: {
    fontSize: "1rem",
    margin: 0,
    padding: 0,
    width: "2rem",
    height: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    margin: "0 .4rem",
  },
  presenterListBtnStyles: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  tagGrid: {
    margin: ".4rem 0",
  },
  chip: {
    marginRight: ".2rem",
    marginTop: ".2rem",
    padding: ".8rem .4rem",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#ccc",
      color: "black",
    },
  },
  corosolStyles: {
    minWidth: "100%",
    minHeight: "100%",
  },
  avatarStyles: {
    fontSize: "1.4rem",
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  arrowBtn: {
    position: "absolute",
    top: 210,
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: "50%",
    backgroundColor: "transparent",
    border: "1px solid black",
    transition: "all ease-in-out .2s",
    "&:hover": {
      cursor: "pointer",
      border: "1px solid white",
      transform: "scale(1.1)",
      background: "white",
    },
  },
  arrowIcon: {
    transition: "all ease-in-out .2s",
    color: "black",
    "&:hover": {
      color: "black",
      cursor: "pointer",
      transform: "scale(1.1)",
    },
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
  const [viewRewardModal, setViewRewardModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [gallery, setGallery] = useState(0);
  const confirmation = useConfirm();
  const history = useHistory();
  const classes = useStyles();
  if (props.history.location.pathname !== currLocation) {
    setLoading(true);
    setCurrLocation(props.history.location.pathname);
  }

  useEffect(() => {
    const config = {};
    if (props.isAuthenticated) {
      config.headers = {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      };
    }
    getProjectById(props.match.params.id)
      .then((resp) => {
        setProject(resp.data);
        console.log(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        props.setModalState(true, `Something went wrong! Check network.`);
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
      });

    getProjects()
      .then((resp) => {
        const randomSuggestions = _.shuffle(resp.data, 5);
        setSuggestions(randomSuggestions.slice(0, 15));
        setSuggestionsLoading(false);
      })
      .catch((error) => {
        setSuggestionsLoading(false);
        console.log("Something went wrong!", error);
      });
  }, [currLocation]);
  const vote = async (type) => {
    if (type) {
      //vote project
      voteProject({ pid: project._id, type })
        .then(async (_resp) => {
          //refresh data
          const updatedProject = await getProjectById(project._id);
          // updatedProject.data.photos = createPhotos(updatedProject.data.photos);
          setProject(updatedProject.data);
        })
        .catch((error) => {
          console.log("er: ", error);
          props.setModalState(true, `Something went wrong! Try again later.`);
          setTimeout(() => {
            props.setModalState(false, "");
          }, 3000);
        });
    }
  };

  const reward = async () => {
    //reward project
    rewardProject({ pid: project._id })
      .then(async (_resp) => {
        //refresh data
        const updatedProject = { ...project };
        // updatedProject.data.photos = createPhotos(updatedProject.data.photos);
        const alreadyRewarded = project.rewards.some(
          (rewardingOrg) =>
            rewardingOrg._id.toString() ===
            props.authenticatedUser._id.toString()
        );
        if (alreadyRewarded) {
          //remove reward
          updatedProject.rewards = updatedProject.rewards.filter(
            (reward) =>
              reward._id.toString() !== props.authenticatedUser._id.toString()
          );
          updatedProject.rewarded = false;
        } else {
          //reward project

          updatedProject.rewards = [
            ...updatedProject.rewards,
            props.authenticatedUser,
          ];
          updatedProject.rewarded = true;
        }
        // const updatedProject = await getProjectById(project._id);
        setProject(updatedProject);
      })
      .catch((error) => {
        props.setModalState(true, `Something went wrong! Try again later.`);
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
      });
  };

  const nextPhoto = () => {
    setGallery((prev) => {
      if (prev >= project.photos.length - 1) {
        return prev;
      }
      return prev + 1;
    });
  };

  const prevPhoto = () => {
    setGallery((prev) => {
      if (prev <= 0) return prev;
      return prev - 1;
    });
  };

  const postComment = () => {
    if (!props.isAuthenticated) {
      props.setModalState(true, "Login to continue");
      setTimeout(() => {
        props.setModalState(false, "");
      }, 3000);
      return history.push("/auth");
    }
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

  const deleteComment = () => {
    const configs = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    confirmation({
      description: "Delete this comment permanently?",
      confirmationText: "Delete",
      confirmationButtonProps: { color: "secondary" },
    })
      .then(() => {
        axios
          .delete(`/comment/${editingComment}`, configs)
          .then(() => {
            cancelCommentEditing();
            const updatedProject = { ...project };
            updatedProject.comments = updatedProject.comments.filter(
              (comment) => comment._id.toString() !== editingComment.toString()
            );
            setProject(updatedProject);
            props.setModalState(
              true,
              `Your comment has been deleted permanently!`
            );
          })
          .catch((error) => {
            props.setModalState(true, `Something went wrong! Try again later.`);
          });
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
      })
      .catch((error) => {});
  };

  const updateComment = (index) => {
    const configs = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    const payload = {
      text: editingCommentText,
    };
    setUpdatingComment(true);
    axios
      .patch(`/comment/${editingComment}`, payload, configs)
      .then((resp) => {
        const updatedProject = { ...project };
        updatedProject.comments[index] = resp.data.comment;
        cancelCommentEditing();
        setProject(updatedProject);
        setUpdatingComment(false);
        props.setModalState(
          true,
          `Your comment has been updated successfully!`
        );
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
      })
      .catch((error) => {
        setUpdatingComment(false);
        props.setModalState(true, `Something went wrong! Try again later.`);
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
      });
  };

  if (!loading && !project.title) {
    return (
      <Grid
        item
        xs={12}
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.masterContainer}
      >
        <Typography
          style={{
            marginTop: "8rem",
            color: "#7e7e7e",
          }}
          variant="h5"
        >
          Something went wrong!
        </Typography>
        <Typography
          style={{
            marginTop: ".8rem",
            color: "#aeaeae",
          }}
          variant="h5"
        ></Typography>
        Try again after some time
      </Grid>
    );
  }

  return (
    <Grid item xs={12} container>
      {loading ? (
        <Grid
          item
          xs={12}
          container
          justify="center"
          alignItems="center"
          style={{
            position: "absolute",
            width: "100vw",
            height: "80vh",
          }}
        >
          <Spinner />
        </Grid>
      ) : (
        <Grid
          item
          xs={12}
          container
          direction="row"
          className={classes.mainContainer}
        >
          {viewRewardModal && (
            <ListModal
              linkto="company"
              showModal={viewRewardModal}
              title={"Rewarded By"}
              list={project.rewards}
              setShowModal={setViewRewardModal}
            />
          )}
          <Grid
            item
            xs={12}
            md={8}
            container
            direction="column"
            className={classes.projectContainer}
          >
            <Grid container direction="row" justify="space-between">
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

            <Grid
              container
              direction="row"
              justify="flex-start"
              className={classes.tagGrid}
            >
              {project.tags.map((tag) => (
                <NavLink
                  to={`/search/?q=${tag}&type=tag`}
                  className={classes.link}
                >
                  <Chip size="small" label={tag} className={classes.chip} />
                </NavLink>
              ))}
            </Grid>

            <Grid container>
              {!!project.photos && project.photos.length ? (
                <Grid
                  container
                  justify="center"
                  alignItems="center"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    minHeight: "25rem",
                    background: "#eee",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    flexWrap: "nowrap",
                  }}
                >
                  {gallery > 0 && (
                    <span
                      onClick={prevPhoto}
                      className={classes.arrowBtn}
                      style={{
                        left: 15,
                      }}
                    >
                      <NavigateBeforeSharpIcon
                        className={classes.arrowIcon}
                        style={{
                          fontSize: "2rem",
                          alignSelf: "center",
                        }}
                      />
                    </span>
                  )}
                  <img src={project.photos[gallery]} width="100%" />
                  {/* <ImageGallery
                    items={project.photos}
                    showBullets={true}
                    showThumbnails={false}
                    showFullscreenButton={false}
                    showPlayButton={false}
                    infinite={false}
                    slideDuration={200}
                  /> */}
                  {gallery < project.photos.length - 1 && (
                    <span
                      onClick={nextPhoto}
                      className={classes.arrowBtn}
                      style={{
                        right: 15,
                      }}
                    >
                      <NavigateNextSharpIcon
                        className={classes.arrowIcon}
                        style={{
                          fontSize: "2rem",
                          alignSelf: "center",
                        }}
                      />
                    </span>
                  )}
                </Grid>
              ) : (
                <Grid
                  container
                  justify="center"
                  alignItems="center"
                  style={{
                    minWidth: "100%",
                    minHeight: "15rem",
                  }}
                >
                  <Typography
                    style={{
                      color: "#777",
                    }}
                  >
                    No Image Available
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Grid
              container
              direction="row"
              style={{
                marginTop: ".4rem",
              }}
            >
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
              <Grid item xs={3} container direction="row" alignItems="center">
                <IconButton
                  disabled={
                    !(
                      props.isAuthenticated &&
                      props.as.toLowerCase() === "company"
                    )
                  }
                  className={classes.rewardBtnStyles}
                  onClick={() => reward()}
                >
                  <FontAwesomeIcon
                    icon={faMedal}
                    className={
                      project.rewarded
                        ? `${classes.reward} ${classes.rewarded}`
                        : classes.reward
                    }
                    size="lg"
                  />
                </IconButton>
                <Typography
                  onClick={() => setViewRewardModal(true)}
                  className={classes.presenterListBtnStyles}
                >
                  {project.rewards && project.rewards.length}
                </Typography>
              </Grid>
            </Grid>
            <Divider style={{ marginBottom: ".7rem" }} />
            <Grid container direction="row">
              <Grid item xs={1} justify="center" style={{ maxWidth: "3rem" }}>
                {project.developer.avatar ? (
                  <Avatar
                    className={classes.avatarStyles}
                    src={project.developer.avatar}
                  >
                    {project.developer.name.charAt(0)}
                  </Avatar>
                ) : (
                  <Avatar style={{ fontSize: "1.4rem", margin: ".3rem" }}>
                    {project.developer.name.charAt(0)}
                  </Avatar>
                )}
              </Grid>

              <Grid
                item
                xs={10}
                style={{
                  marginLeft: ".4rem",
                }}
              >
                <NavLink
                  to={`/dev/${project.developer._id}`}
                  className={classes.link}
                >
                  <Typography style={{ fontWeight: 600, color: "#000" }}>
                    {project.developer.name}
                  </Typography>
                </NavLink>
                <Typography
                  paragraph
                  style={{ transition: "all 1s ease-in-out" }}
                >
                  {project.about.length < 80 || expanded ? (
                    <Grid
                      container
                      direction="row"
                      style={{
                        whiteSpace: "pre-wrap",
                      }}
                    >
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
              </Grid>
              <Divider style={{ marginBottom: ".7rem" }} />
            </Grid>
            <Grid container direction="column">
              <Grid
                style={{
                  marginTop: "1rem",
                }}
              >
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
                  onClick={() => {
                    if (!props.isAuthenticated) {
                      history.push("/auth");
                    }
                  }}
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
                        container
                        direction="row"
                        className={classes.commentStyle}
                        style={{ flexWrap: "nowrap" }}
                      >
                        <Grid item xs={1}>
                          {comment.by.avatar || comment.by.logo ? (
                            <Avatar
                              className={classes.avatarStyles}
                              src={comment.by.avatar || comment.by.logo}
                            />
                          ) : (
                            <Avatar className={classes.blankAvatarStyles}>
                              {comment.by.username.charAt(0)}
                            </Avatar>
                          )}
                        </Grid>
                        <Grid item={10} container direction="column">
                          <TextField
                            focused
                            id="editable-comment"
                            value={editingCommentText}
                            multiline
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
                          <Grid container direction="row" justify="flex-end">
                            <Button
                              variant="contained"
                              onClick={() => deleteComment()}
                              style={{ marginRight: ".7rem", color: "red" }}
                            >
                              <DeleteIcon />
                            </Button>
                            <Button
                              variant="contained"
                              onClick={() => cancelCommentEditing()}
                            >
                              CANCEL
                            </Button>
                            <Button
                              disabled={
                                !!!editingCommentText || updatingComment
                              }
                              variant="contained"
                              color="primary"
                              style={{ marginLeft: ".7rem" }}
                              onClick={() => updateComment(index)}
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
                      </Grid>
                    );
                  } else {
                    return (
                      <Grid
                        key={comment._id}
                        item
                        xs={12}
                        container
                        direction="row"
                        alignItems="flex-start"
                        className={classes.commentStyle}
                        style={{
                          flexWrap: "nowrap",
                        }}
                      >
                        <Grid
                          item
                          xs={1}
                          style={{
                            maxWidth: "2.5rem",
                            paddingTop: ".4rem",
                          }}
                        >
                          {comment.by.avatar || comment.by.logo ? (
                            <Avatar
                              className={classes.avatarStyles}
                              src={comment.by.avatar || comment.by.logo}
                            />
                          ) : (
                            <Avatar className={classes.blankAvatarStyles}>
                              {comment.by.username.charAt(0)}
                            </Avatar>
                          )}
                        </Grid>
                        <Grid
                          item
                          xs={10}
                          container
                          direction="column"
                          style={{
                            marginLeft: "1rem",
                            wordWrap: "break-word",
                            flexWrap: "wrap",
                          }}
                        >
                          <Grid
                            container
                            direction="row"
                            justify="space-between"
                            style={{
                              maxHeight: "2.3rem",
                            }}
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
                                className={classes.timeTypeStyles}
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
                          <Typography
                            style={{
                              maxWidth: "100%",
                              wordWrap: "break-word",
                            }}
                          >
                            {comment.text}
                          </Typography>
                        </Grid>
                      </Grid>
                    );
                  }
                })}
              </Grid>
            </Grid>
          </Grid>
          <Hidden mdDown>
            <Grid
              item
              xs={3}
              container
              direction="column"
              alignItems="center"
              style={{
                padding: "2rem 1rem",
                flexWrap: "nowrap",
              }}
            >
              <Typography
                variant="h6"
                style={{ fontWeight: 600, minWidth: "100%" }}
              >
                Similar Projects
              </Typography>
              {!suggestions.length ? (
                <Grid
                  item
                  xs={12}
                  container
                  justify="center"
                  style={{ marginTop: "4rem" }}
                >
                  <Spinner />
                </Grid>
              ) : (
                <Grid container>
                  {suggestions.map((project) => (
                    <SideSuggestionBlock project={project} />
                  ))}
                </Grid>
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

const mapDispatchToProps = (dispatch) => {
  return {
    setModalState: (modalState, text) =>
      dispatch(setModalStateAction({ showModal: modalState, text })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
