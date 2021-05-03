import {
  Avatar,
  CircularProgress,
  Grid,
  Hidden,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import {
  getDeveloperById,
  unfollowUser,
  followUser,
} from "../utility/utilityFunctions/ApiCalls";
import { makeStyles } from "@material-ui/core/styles";
import { Button, IconButton } from "@material-ui/core";
import { useHistory, NavLink } from "react-router-dom";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import HttpIcon from "@material-ui/icons/Http";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import ExpandableProjectCard from "./ExpandableProjectCard";
import ListModal from "./ListModal";
import Spinner from "./Spinner";
import { setModalStateAction } from "../actions/modalActions";
import { connect } from "react-redux";
import TableChartOutlinedIcon from "@material-ui/icons/TableChartOutlined";
import ViewAgendaOutlinedIcon from "@material-ui/icons/ViewAgendaOutlined";
import TableView from "./TableView";
import { Edit, Edit3 } from "react-feather";

const useStyles = makeStyles((theme) => ({
  containerStyles: {
    position: "absolute",
    top: "50%",
    left: "50%",
    [theme.breakpoints.down("xs")]: {
      left: "40%",
      top: "45%",
    },
  },
  mainContainer: {
    background: "#F3F3F3",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
  },
  smProfile: {
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "1rem",
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
    background: "white",
    minHeight: "90vh",
    maxHeight: "90vh",
    borderRight: "1px solid #e1e1e1",
  },
  labelStyle: {
    fontWeight: "400",
    marginRight: ".3rem",
  },
  linkStyles: {
    textDecoration: "none",
  },
  userField: {
    marginBottom: "8px",
  },
}));

const DevPage = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [developer, setDeveloper] = useState({});
  const [currLocation, setCurrLocation] = useState("");
  const [error, setError] = useState("");
  const [popupOf, setPopupOf] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [alreadyFollowing, setAlreadyFollowing] = useState(false);
  const [btnInAction, setBtnInAction] = useState(false);
  const [view, setView] = useState("cards");
  const history = useHistory();

  if (props.history.location.pathname !== currLocation) {
    setLoading(true);
    setCurrLocation(props.history.location.pathname);
    setLoading(true);
    setShowModal(false);
    setPopupOf("");
  }

  useEffect(() => {
    const viewPath = props.location.pathname.replace(props.match.url, "");
    if (
      viewPath !== "/followers" &&
      viewPath !== "/following" &&
      viewPath !== ""
    ) {
      history.replace(props.match.url);
    }

    getDeveloperById(props.match.params.id)
      .then((resp) => {
        const dummyLinks = {
          website: "",
          linkedIn: "",
          portfolio: "",
          github: "",
        };
        if (!resp.data.websites) {
          resp.data.websites = dummyLinks;
        }
        Object.keys(dummyLinks).forEach((link) => {
          if (!resp.data.websites[link]) {
            resp.data.websites[link] = "";
          }
        });
        setDeveloper(resp.data);
        setLoading(false);
        if (viewPath === "/followers") {
          setPopupOf("followers");
          setShowModal(true);
        } else if (viewPath === "/following") {
          setPopupOf("following");
          setShowModal(true);
        }

        //check if authed user is already following this developer or not
        if (props.authedAs && props.authedAs.toLowerCase() === "developer") {
          if (
            resp.data.followers.some(
              (follower) =>
                follower._id.toString() === props.authedUserId.toString()
            )
          ) {
            setAlreadyFollowing(true);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.data) {
          props.setModalState(
            true,
            `Something went wrong! ${error.response.data.error}`
          );
        }
        props.setModalState(true, `Something went wrong!`);
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
      });
  }, [currLocation]);

  const follow = () => {
    setBtnInAction(true);
    followUser(developer._id)
      .then((res) => {
        setBtnInAction(false);
        const updatedDeveloper = { ...developer };
        updatedDeveloper.followers = updatedDeveloper.followers.concat(
          props.user
        );
        setDeveloper(updatedDeveloper);
        setAlreadyFollowing(true);
        props.setModalState(
          true,
          `You are now following ${developer.username}`
        );
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
      })
      .catch((_error) => {
        setBtnInAction(false);
        props.setModalState(
          true,
          "Something went wrong! try again after some time"
        );
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
      });
  };

  const unfollow = () => {
    setBtnInAction(true);
    unfollowUser(developer._id)
      .then((res) => {
        setBtnInAction(false);
        const updatedDeveloper = { ...developer };
        updatedDeveloper.followers = updatedDeveloper.followers.filter(
          (follower) => follower._id.toString() !== props.user._id.toString()
        );
        setDeveloper(updatedDeveloper);
        setAlreadyFollowing(false);
        props.setModalState(true, `unfollowed ${developer.username}`);
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
      })
      .catch((_error) => {
        setBtnInAction(false);
        props.setModalState(
          true,
          "Something went wrong! try again after some time"
        );
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
      });
  };

  const updateProjects = (projects) => {
    setDeveloper((prevState) => ({ ...prevState, projects }));
  };

  return (
    <Grid container style={{ overflowX: "hidden" }}>
      {popupOf === "followers" && (
        <ListModal
          showModal={showModal}
          id={props.match.params.id}
          title={"Followers"}
          list={developer.followers}
          setShowModal={setShowModal}
        />
      )}
      {popupOf === "following" && (
        <ListModal
          id={props.match.params.id}
          title={"Following"}
          showModal={showModal}
          setShowModal={setShowModal}
          list={developer.following}
        />
      )}
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
      {!!Object.keys(developer).length && (
        <Grid container item xs={12} className={classes.mainContainer}>
          <Hidden mdUp>
            <Grid
              item
              xs={12}
              container
              direction="column"
              className={classes.smProfile}
            >
              <Grid
                item
                container
                align="center"
                justify="center"
                alignItems="center"
              >
                <Avatar style={{ fontSize: "1.4rem", margin: ".3rem" }}>
                  {developer.name.charAt(0)}
                </Avatar>
                <Typography color="textSecondary" style={{ margin: ".1rem 0" }}>
                  @{developer.username}
                </Typography>
              </Grid>

              <Typography className={classes.userField}>
                <b>Name: </b>
                {developer.name}
              </Typography>
              <Typography className={classes.userField}>
                <b style={{ marginRight: ".3rem" }}> Email:</b>
                {developer.email}
              </Typography>
              {props.authedAs &&
                props.authedAs.toLowerCase() === "developer" &&
                developer._id !== props.authedUserId && (
                  <>
                    {alreadyFollowing && (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => unfollow()}
                      >
                        {btnInAction ? (
                          <Grid container justify="center" alignItems="center">
                            <CircularProgress size={24} color="primary" />
                          </Grid>
                        ) : (
                          "UnFollow"
                        )}
                      </Button>
                    )}
                    {!alreadyFollowing && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => follow()}
                      >
                        {btnInAction ? (
                          <Grid container justify="center" alignItems="center">
                            <CircularProgress size={24} color="secondary" />
                          </Grid>
                        ) : (
                          "Follow"
                        )}
                      </Button>
                    )}
                  </>
                )}
              <NavLink
                to={`/dev/${developer._id}/followers`}
                className={classes.linkStyles}
              >
                <Button
                  variant="outlined"
                  style={{
                    margin: ".7rem 0",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Typography className={classes.labelStyle}>
                    Followers:
                  </Typography>
                  <Typography> {developer.followers.length}</Typography>
                </Button>
              </NavLink>

              <NavLink
                to={`/dev/${developer._id}/following`}
                className={classes.linkStyles}
              >
                <Button
                  variant="outlined"
                  style={{
                    margin: ".7rem 0",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Typography className={classes.labelStyle}>
                    Following:
                  </Typography>
                  <Typography> {developer.following.length}</Typography>
                </Button>
              </NavLink>
              <Grid
                container
                direction="row"
                style={{
                  alignSelf: "center",
                  justifyContent: "center",
                }}
              >
                <IconButton
                  disabled={!developer.websites || !developer.websites.github}
                  aria-label="github"
                  size="small"
                  href={developer.websites ? developer.websites.github : ""}
                  target="_blank"
                >
                  <Tooltip title="github">
                    <GitHubIcon style={{ fontSize: "1.7rem" }} />
                  </Tooltip>
                </IconButton>
                <IconButton
                  disabled={!developer.websites || !developer.websites.linkedIn}
                  aria-label="linkedIn"
                  size="medium"
                  href={developer.websites ? developer.websites.linkedIn : ""}
                  target="_blank"
                >
                  <Tooltip title="linkedIn">
                    <LinkedInIcon style={{ fontSize: "1.7rem" }} />
                  </Tooltip>
                </IconButton>
                <IconButton
                  disabled={!developer.websites || !developer.websites.website}
                  aria-label="website"
                  size="medium"
                  href={developer.websites ? developer.websites.website : ""}
                  target="_blank"
                >
                  <Tooltip title="website">
                    <HttpIcon style={{ fontSize: "1.7rem" }} />
                  </Tooltip>
                </IconButton>
                <IconButton
                  disabled={
                    !developer.websites || !developer.websites.portfolio
                  }
                  aria-label="portfolio"
                  size="medium"
                  href={developer.websites ? developer.websites.portfolio : ""}
                  target="_blank"
                >
                  <Tooltip title="portfolio">
                    <AssignmentIndIcon style={{ fontSize: "1.7rem" }} />
                  </Tooltip>
                </IconButton>
              </Grid>
            </Grid>
          </Hidden>
          <Hidden smDown>
            <Grid
              item
              xs={3}
              container
              justify="center"
              alignItems="center"
              className={classes.profile}
            >
              <Grid
                container
                direction="column"
                style={{
                  position: "fixed",
                  width: "15rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <Grid container direction="column">
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{
                      padding: ".6rem",
                      background: "#02475e",
                      borderRadius: "4px 4px 0 0",
                    }}
                  >
                    {props.authedAs &&
                      props.authedAs.toLowerCase() === "developer" &&
                      developer._id === props.authedUserId && (
                        <NavLink
                          to={`/profile/edit`}
                          style={{
                            position: "absolute",
                            color: "white",
                            right: 10,
                            top: 10,
                          }}
                        >
                          <Edit3 />
                        </NavLink>
                      )}
                    <Avatar style={{ fontSize: "1.4rem", margin: ".3rem" }}>
                      {developer.name.charAt(0)}
                    </Avatar>
                    <Typography
                      color="textSecondary"
                      style={{
                        margin: ".1rem 0",
                        fontFamily: "Loto Sans JP",
                        color: "white",
                      }}
                    >
                      @{developer.username}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    direction="column"
                    style={{
                      padding: ".4rem",
                    }}
                  >
                    <Typography className={classes.userField}>
                      <b>Name: </b>
                      {developer.name}
                    </Typography>
                    <Typography className={classes.userField}>
                      <b style={{ marginRight: ".3rem" }}> Email:</b>
                      {developer.email}
                    </Typography>
                    {props.authedAs &&
                      props.authedAs.toLowerCase() === "developer" &&
                      developer._id !== props.authedUserId && (
                        <>
                          {alreadyFollowing && (
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => unfollow()}
                              style={{ width: "9.5rem" }}
                            >
                              {btnInAction ? (
                                <Grid
                                  container
                                  justify="center"
                                  alignItems="center"
                                >
                                  <CircularProgress size={24} color="primary" />
                                </Grid>
                              ) : (
                                "UnFollow"
                              )}
                            </Button>
                          )}
                          {!alreadyFollowing && (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => follow()}
                              style={{ width: "9.5rem" }}
                            >
                              {btnInAction ? (
                                <Grid
                                  container
                                  justify="center"
                                  alignItems="center"
                                >
                                  <CircularProgress
                                    size={24}
                                    color="secondary"
                                  />
                                </Grid>
                              ) : (
                                "Follow"
                              )}
                            </Button>
                          )}
                        </>
                      )}

                    <NavLink
                      to={`/dev/${developer._id}/followers`}
                      className={classes.linkStyles}
                    >
                      <Button
                        variant="outlined"
                        style={{
                          margin: ".4rem 0",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Typography className={classes.labelStyle}>
                          Followers:
                        </Typography>
                        <Typography> {developer.followers.length}</Typography>
                      </Button>
                    </NavLink>

                    <NavLink
                      to={`/dev/${developer._id}/following`}
                      className={classes.linkStyles}
                    >
                      <Button
                        variant="outlined"
                        style={{
                          display: "flex",
                          marginBottom: ".4rem",
                          flexDirection: "row",
                        }}
                      >
                        <Typography className={classes.labelStyle}>
                          Following:
                        </Typography>
                        <Typography> {developer.following.length}</Typography>
                      </Button>
                    </NavLink>
                    <Grid container direction="row">
                      <IconButton
                        disabled={!developer.websites.github}
                        aria-label="github"
                        size="small"
                        href={developer.websites.github}
                        target="_blank"
                      >
                        <Tooltip title="github">
                          <GitHubIcon style={{ fontSize: "1.2rem" }} />
                        </Tooltip>
                      </IconButton>
                      <IconButton
                        disabled={!developer.websites.linkedIn}
                        aria-label="linkedIn"
                        size="medium"
                        href={developer.websites.linkedIn}
                        target="_blank"
                      >
                        <Tooltip title="linkedIn">
                          <LinkedInIcon style={{ fontSize: "1.2rem" }} />
                        </Tooltip>
                      </IconButton>
                      <IconButton
                        disabled={!developer.websites.website}
                        aria-label="website"
                        size="medium"
                        href={developer.websites.website}
                        target="_blank"
                      >
                        <Tooltip title="website">
                          <HttpIcon style={{ fontSize: "1.2rem" }} />
                        </Tooltip>
                      </IconButton>
                      <IconButton
                        disabled={!developer.websites.portfolio}
                        aria-label="portfolio"
                        size="medium"
                        href={developer.websites.portfolio}
                        target="_blank"
                      >
                        <Tooltip title="portfolio">
                          <AssignmentIndIcon style={{ fontSize: "1.2rem" }} />
                        </Tooltip>
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Hidden>
          <Grid
            container
            item
            align="center"
            direction="column"
            xs={9}
            style={{
              padding: "2rem 0",
              minHeight: "90vh",
            }}
          >
            <Grid container direction="row" justify="center">
              <Typography component="h2" variant="h4">
                Projects
              </Typography>
              {developer._id === props.user._id && (
                <>
                  <Tooltip title="table view">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                      style={{
                        color: `${view === "table" ? "blue" : "black"}`,
                      }}
                      onClick={() => setView("table")}
                    >
                      <TableChartOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="card view">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                      style={{
                        color: `${view === "cards" ? "blue" : "black"}`,
                      }}
                      onClick={() => setView("cards")}
                    >
                      <ViewAgendaOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Grid>
            <Grid container item direction="row" xs={12}>
              {!!developer.projects.length ? (
                view === "cards" ? (
                  developer.projects.map((project) => {
                    return (
                      <Grid
                        item
                        md={5}
                        xs={12}
                        key={project._id}
                        style={{
                          margin: "1rem",
                        }}
                      >
                        <ExpandableProjectCard project={project} />
                      </Grid>
                    );
                  })
                ) : (
                  <TableView
                    projects={developer.projects}
                    updateProjects={updateProjects}
                    haveAccess={developer._id === props.user._id}
                  />
                )
              ) : (
                <Typography
                  style={{
                    textAlign: "center",
                    width: "100%",
                    margin: "4rem 0",
                    color: "#7f7f7f",
                  }}
                >
                  No Projects to show
                </Typography>
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
    authedUserId: state.authReducer.user._id,
    user: state.authReducer.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setModalState: (modalState, text) =>
      dispatch(setModalStateAction({ showModal: modalState, text })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DevPage);
