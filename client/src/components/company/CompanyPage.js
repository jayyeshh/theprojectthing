import {
  Avatar,
  Button,
  Divider,
  Grid,
  Hidden,
  IconButton,
  Tooltip,
  Chip,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { getCompanyByUsername } from "../../utility/utilityFunctions/ApiCalls";
import { makeStyles } from "@material-ui/core/styles";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import Spinner from "../spinners/Spinner";
import CompanyPost from "./CompanyPost";
import moment from "moment";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import HttpIcon from "@material-ui/icons/Http";
import { NavLink } from "react-router-dom";
import { setModalStateAction } from "../../actions/modalActions";
import { connect } from "react-redux";
import AddReviewPopupModal from "./AddReviewPopupModal";
import ListModal from "../modals/ListModal";
import { Edit3 } from "react-feather";
import ErrorPage from "../shared/ErrorPage";

const useStyles = makeStyles((theme) => ({
  containerStyles: {
    position: "absolute",
    top: "50%",
    left: "45%",
    [theme.breakpoints.down("xs")]: {
      top: "40%",
      left: "35%",
    },
  },
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  boldLabel: {
    fontWeight: 600,
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  profile: {
    padding: "4rem",
    overflow: "hidden",
    minHeight: "100%",
    [theme.breakpoints.down("xs")]: {
      position: "relative",
      minHeight: "18rem",
      maxHeight: "4rem",
      backgroundColor: "#e1e1e1",
      margin: 0,
      padding: 0,
      justifyContent: "center",
      alignItems: "center",
    },
  },
  editIconStyles: {
    alignSelf: "flex-end",
    color: "black",
    textAlign: "right",
    zIndex: 1,
    transition: "all ease-in-out .2s",
    "&:hover": {
      transform: "scale(1.03)",
      cursor: "pointer",
      color: "blue",
    },
  },
  profileSubContainer: {
    position: "fixed",
    width: "15rem",
    alignItems: "center",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      position: "relative",
    },
  },
  labelStyle: {
    fontWeight: "400",
    marginRight: ".3rem",
  },
  link: {
    textDecoration: "none",
    "&:hover": {
      cursor: "pointer",
    },
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
  avatarStyles: {
    fontSize: "1.4rem",
    margin: ".3rem",
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  techGrid: {
    maxHeight: "8rem",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
}));

const CompanyPage = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState({});
  const [currLocation, setCurrLocation] = useState("");
  const [type, setType] = useState("posts");
  const [error, setError] = useState(false);
  const [addReviewPopup, setAddReviewPopup] = useState(false);
  const [showInterestedDevs, setShowInterestedDevs] = useState(false);
  const [list, setList] = useState([]);

  if (props.history.location.pathname !== currLocation) {
    setLoading(true);
    setCurrLocation(props.history.location.pathname);
  }

  const toggleBtnHandler = (event, newValue) => {
    if (newValue) {
      setType(newValue);
    }
  };

  const updateReviews = (review) => {
    const updatedCompany = { ...company };
    updatedCompany.reviews = [...updatedCompany.reviews, review];
    setCompany(updatedCompany);
    setAddReviewPopup(false);
  };

  useEffect(() => {
    getCompanyByUsername(props.match.params.username)
      .then((resp) => {
        setCompany(resp.data);
        setLoading(false);
        setError(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(true);
      });
  }, [props.match.params.username]);

  const updatePost = (updatedPost, index) => {
    const updatedPosts = [...company.posts];
    updatedPosts[index] = updatedPost;
    setCompany({ ...company, posts: updatedPosts });
  };

  const removePost = (postIndex) => {
    const updatedPosts = [...company.posts];
    updatedPosts.splice(postIndex, 1);
    setCompany({ ...company, posts: updatedPosts });
  };

  const handleShowInterestedDevs = (index) => {
    setList(company.posts[index].interested);
    setShowInterestedDevs(true);
  };

  if (error) {
    return <ErrorPage />;
  }

  return (
    <Grid
      item
      xs={12}
      container
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#F3F3F3",
        flexWrap: "none",
      }}
    >
      <ListModal
        showModal={showInterestedDevs}
        title={"Interested Developers"}
        list={list}
        setShowModal={setShowInterestedDevs}
      />
      <AddReviewPopupModal
        companyId={props.match.params.id}
        addReviewPopup={addReviewPopup}
        setAddReviewPopup={setAddReviewPopup}
        updateReviews={updateReviews}
        setModalState={props.setModalState}
      />
      {error && <h4 style={{ color: "red" }}>{error}</h4>}
      {loading && (
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
      )}
      {!!Object.keys(company).length && (
        <Grid
          item
          xs={12}
          container
          direction="column"
          style={{
            minHeight: "90vh",
          }}
        >
          <Grid
            item
            xs={12}
            sm={3}
            container
            direction="column"
            alignItems="center"
            className={classes.profile}
          >
            <Hidden xsDown>
              <div
                style={{
                  position: "fixed",
                  display: "flex",
                  justifyContent: "center",
                  top: "4rem",
                  left: 0,
                  width: "30%",
                  paddingTop: "3rem",
                }}
              >
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                  align="center"
                  style={{
                    padding: "1rem",
                    maxWidth: "80%",
                    alignSelf: "center",
                    background: "white",
                  }}
                >
                  {props.authenticated &&
                    company._id.toString() === props.uid.toString() && (
                      <NavLink
                        to={`/profile/edit`}
                        className={classes.editIconStyles}
                      >
                        <Edit3 />
                      </NavLink>
                    )}
                  <Grid
                    style={{
                      position: "absolute",
                      background: "#f3bda1",
                      width: "80%",
                      height: "7rem",
                      borderRadius: "5px 5px 0 0",
                      top: "3rem",
                      paddingTop: "1rem",
                    }}
                  >
                    {company.logo ? (
                      <Avatar
                        className={classes.avatarStyles}
                        src={company.logo}
                      >
                        {company.name.charAt(0)}
                      </Avatar>
                    ) : (
                      <Avatar style={{ fontSize: "1.4rem", margin: ".3rem" }}>
                        {company.name.charAt(0)}
                      </Avatar>
                    )}

                    <Typography
                      color="textSecondary"
                      style={{
                        margin: ".1rem 0",
                        zIndex: 1,
                        fontWeight: 600,
                      }}
                    >
                      @{company.username}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    style={{
                      marginTop: `${
                        props.authenticated && company._id === props.uid
                          ? ""
                          : "2rem"
                      }`,
                    }}
                  >
                    <Typography
                      style={{
                        marginTop: "5.8rem",
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        fontFamily: "Lato",
                      }}
                    >
                      {company.name}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="flex-start"
                    style={{
                      textAlign: "left",
                    }}
                  >
                    <Typography style={{ color: "#444" }}>
                      {company.about}
                    </Typography>

                    <Typography className={classes.boldLabel}>
                      Email:
                    </Typography>
                    <Typography style={{ color: "#444" }}>
                      {company.email}
                    </Typography>
                    <Typography className={classes.boldLabel}>
                      Joined:
                    </Typography>
                    <Typography style={{ color: "#444" }}>
                      {new moment(company.createdAt).format("YYYY, MMM, DD")}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    style={{
                      alignSelf: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconButton
                      disabled={!company.websites || !company.websites.linkedIn}
                      aria-label="linkedIn"
                      size="medium"
                      href={company.websites ? company.websites.linkedIn : ""}
                      target="_blank"
                    >
                      <Tooltip title="linkedIn">
                        <LinkedInIcon style={{ fontSize: "1.7rem" }} />
                      </Tooltip>
                    </IconButton>
                    <IconButton
                      disabled={!company.websites || !company.websites.website}
                      aria-label="website"
                      size="medium"
                      href={company.websites ? company.websites.website : ""}
                      target="_blank"
                    >
                      <Tooltip title="website">
                        <HttpIcon style={{ fontSize: "1.7rem" }} />
                      </Tooltip>
                    </IconButton>
                  </Grid>
                  {!!company.technologies.length && (
                    <Grid container>
                      <Typography
                        style={{
                          fontWeight: 600,
                          color: "#333",
                          fontFamily: "Lato",
                        }}
                      >
                        Technologies
                      </Typography>
                      <Grid container className={classes.techGrid}>
                        {company.technologies.map((tech) => (
                          <NavLink
                            to={`/search/?q=${tech}&type=tag`}
                            className={classes.link}
                            key={company.tech}
                          >
                            <Chip
                              size="small"
                              label={tech}
                              className={classes.chip}
                            />
                          </NavLink>
                        ))}
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </div>{" "}
            </Hidden>
            <Hidden smUp>
              <Grid
                container
                justify="center"
                className={classes.profileSubContainer}
              >
                <Grid>
                  {company.logo ? (
                    <Avatar className={classes.avatarStyles} src={company.logo}>
                      {company.name.charAt(0)}
                    </Avatar>
                  ) : (
                    <Avatar style={{ fontSize: "1.4rem", margin: ".3rem" }}>
                      {company.name.charAt(0)}
                    </Avatar>
                  )}
                </Grid>
                <Typography color="textSecondary" style={{ margin: ".1rem 0" }}>
                  @{company.username}
                </Typography>
                <Typography
                  style={{
                    fontFamily: "Loto Sans JP",
                    fontWeight: 600,
                    fontSize: "1.5rem",
                  }}
                >
                  {company.name}
                </Typography>
                <Grid container>
                  <Typography className={classes.boldLabel}>Email:</Typography>
                  <Typography style={{ marginLeft: ".4rem" }}>
                    {company.email}
                  </Typography>
                </Grid>
                <Grid
                  container
                  direction="row"
                  style={{
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    disabled={!company.websites || !company.websites.linkedIn}
                    aria-label="linkedIn"
                    size="medium"
                    href={company.websites ? company.websites.linkedIn : ""}
                    target="_blank"
                  >
                    <Tooltip title="linkedIn">
                      <LinkedInIcon style={{ fontSize: "1.7rem" }} />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    disabled={!company.websites || !company.websites.website}
                    aria-label="website"
                    size="medium"
                    href={company.websites ? company.websites.website : ""}
                    target="_blank"
                  >
                    <Tooltip title="website">
                      <HttpIcon style={{ fontSize: "1.7rem" }} />
                    </Tooltip>
                  </IconButton>
                </Grid>
              </Grid>
            </Hidden>
          </Grid>
          <Hidden xsDown>
            <Divider orientation="vertical" />
          </Hidden>

          <Grid
            item
            sm={7}
            xs={12}
            container
            direction="row"
            align="center"
            style={{
              padding: "2rem 0",
            }}
          >
            <Grid
              item
              xs={12}
              container
              justify="center"
              style={{
                maxHeight: "4rem",
                minWidth: "100%",
              }}
            >
              <ToggleButtonGroup
                exclusive
                value={type}
                onChange={toggleBtnHandler}
                style={{
                  alignSelf: "center",
                }}
              >
                <ToggleButton value="posts">
                  <Typography>Posts</Typography>
                </ToggleButton>
                <ToggleButton value="reviews">
                  <Typography>Reviews</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction="row"
              justify="center"
              style={{
                margin: "1rem 0",
              }}
            >
              {type === "posts" && (
                <Grid container justify="center">
                  {!!company.posts.length ? (
                    company.posts.map((post, index) => {
                      return (
                        <CompanyPost
                          handleShowInterestedDevs={handleShowInterestedDevs}
                          post={post}
                          index={index}
                          key={post._id}
                          setModalState={props.setModalState}
                          updatePost={(updatedPost) =>
                            updatePost(updatedPost, index)
                          }
                          removePost={() => {
                            removePost(index);
                          }}
                        />
                      );
                    })
                  ) : (
                    <Grid
                      container
                      justify="center"
                      alignItems="center"
                      style={{
                        width: "60%",
                        backgroundColor: "#eee",
                        padding: ".6rem",
                        margin: "1rem",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography
                        style={{ fontWeight: 400, fontSize: "1.4rem" }}
                      >
                        No post available
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              )}
              {type === "reviews" && (
                <>
                  {props.authedAs &&
                    props.authedAs.toLowerCase() === "developer" && (
                      <Grid
                        key="add_review"
                        style={{
                          minWidth: "100%",
                        }}
                      >
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => setAddReviewPopup(true)}
                        >
                          Add Review
                        </Button>
                      </Grid>
                    )}
                  {!!company.reviews.length ? (
                    company.reviews.map((review, index) => {
                      return (
                        <Grid
                          container
                          key={review._id}
                          style={{
                            width: "60%",
                            backgroundColor: "#eee",
                            padding: ".6rem",
                            margin: "1rem",
                            borderRadius: "8px",
                          }}
                        >
                          <Grid container direction="column">
                            <Grid
                              container
                              align="space-between"
                              justify="space-between"
                              alignContent="space-between"
                              style={{
                                margin: ".5rem 0",
                              }}
                            >
                              <NavLink
                                to={`/dev/${review.by.username}`}
                                style={{ textDecoration: "none" }}
                              >
                                @{review.by.username}
                              </NavLink>
                              <div style={{ color: "grey" }}>
                                {"reviewed on "}
                                {new moment(review.createdAt).format(
                                  "ddd,DD MMM"
                                )}
                              </div>
                            </Grid>
                            <Divider />
                            <Grid
                              container
                              style={{
                                textAlign: "left",
                                padding: ".6rem 0",
                              }}
                            >
                              {review.text}
                            </Grid>
                          </Grid>
                        </Grid>
                      );
                    })
                  ) : (
                    <Grid
                      container
                      justify="center"
                      alignItems="center"
                      style={{
                        width: "60%",
                        backgroundColor: "#eee",
                        padding: ".6rem",
                        margin: "1rem",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography
                        style={{ fontWeight: 400, fontSize: "1.4rem" }}
                      >
                        No Reviews Yet
                      </Typography>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    authenticated: state.authReducer.authenticated,
    authedAs: state.authReducer.as,
    uid: state.authReducer.user._id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setModalState: (modalState, text, severity) =>
      dispatch(setModalStateAction({ showModal: modalState, text, severity })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyPage);
