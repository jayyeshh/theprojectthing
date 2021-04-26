import {
  Avatar,
  Button,
  Divider,
  Grid,
  Hidden,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { getCompanyById } from "../utility/utilityFunctions/ApiCalls";
import { makeStyles } from "@material-ui/core/styles";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { Container } from "@material-ui/core";
import Spinner from "./Spinner";
import CompanyPost from "./CompanyPost";
import moment from "moment";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import HttpIcon from "@material-ui/icons/Http";
import { NavLink } from "react-router-dom";
import { setModalStateAction } from "../actions/modalActions";
import { connect } from "react-redux";
import AddReviewPopupModal from "./AddReviewPopupModal";
import ListModal from "./ListModal";

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
    display: "flex",
    flexDirection: "column",
    background: "white",
    padding: "4rem",
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      position: "relative",
      minWidth: "100%",
      backgroundColor: "#e1e1e1",
      height: "18rem",
      margin: 0,
      padding: 0,
      justifyContent: "center",
      alignItems: "center",
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
}));

const CompanyPage = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState({});
  const [currLocation, setCurrLocation] = useState("");
  const [type, setType] = useState("posts");
  const [error, setError] = useState("");
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
    getCompanyById(props.match.params.id)
      .then((resp) => {
        setCompany(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  const updatePost = (updatedPost, index) => {
    const updatedPosts = [...company.posts];
    updatedPosts[index] = updatedPost;
    setCompany({ ...company, posts: updatedPosts });
  };

  const handleShowInterestedDevs = (index) => {
    setList(company.posts[index].interested);
    setShowInterestedDevs(true);
  };

  return (
    <Grid
      item
      xs={12}
      container
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
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
            sm={4}
            container
            alignItems="center"
            justify="center"
            className={classes.profile}
          >
            <Hidden xsDown>
              <div
                style={{
                  position: "fixed",
                  top: "4rem",
                  left: 0,
                  minHeight: "100vh",
                  maxHeight: "100vh",
                  width: "35%",
                  paddingTop: "3rem",
                }}
              >
                <Grid
                  item
                  xs={12}
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                >
                  <Avatar
                    style={{
                      fontSize: "1.4rem",
                      margin: ".3rem",
                      border: "2px solid blue",
                      padding: ".4rem",
                    }}
                  >
                    {company.name.charAt(0)}
                  </Avatar>
                  <Typography
                    color="textSecondary"
                    style={{ margin: ".1rem 0" }}
                  >
                    @{company.username}
                  </Typography>
                  <Typography>{company.name}</Typography>
                  <div
                    style={{
                      margin: ".7rem 0",
                      alignSelf: "center",
                    }}
                  >
                    <Typography>Email:</Typography>
                    <Typography> {company.email}</Typography>
                  </div>
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
              </div>
            </Hidden>
            <Hidden smUp>
              <Grid className={classes.profileSubContainer}>
                <Avatar
                  style={{
                    fontSize: "1.4rem",
                    margin: ".3rem",
                    border: "2px solid blue",
                    padding: ".4rem",
                  }}
                >
                  {company.name.charAt(0)}
                </Avatar>
                <Typography color="textSecondary" style={{ margin: ".1rem 0" }}>
                  @{company.username}
                </Typography>
                <Typography>{company.name}</Typography>
                <div
                  style={{
                    margin: ".7rem 0",
                  }}
                >
                  <Typography>Email:</Typography>
                  <Typography> {company.email}</Typography>
                </div>
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
                          updatePost={(updatedPost) =>
                            updatePost(updatedPost, index)
                          }
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
                                to={`/dev/${review.by._id}`}
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
    authedAs: state.authReducer.as,
    uid: state.authReducer.user._id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setModalState: (modalState, text) =>
      dispatch(setModalStateAction({ showModal: modalState, text })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyPage);
