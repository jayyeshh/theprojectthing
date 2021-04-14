import { Avatar, Grid, Hidden, Tooltip, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { getDeveloperById } from "../utility/utilityFunctions/ApiCalls";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Button, IconButton } from "@material-ui/core";
import { useHistory, NavLink } from "react-router-dom";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import HttpIcon from "@material-ui/icons/Http";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import Spinner from "./Spinner";
import ExpandableProjectCard from "./ExpandableProjectCard";
import ListModal from "./ListModal";

const useStyles = makeStyles((theme) => ({
  containerStyles: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  mainContainer: {
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
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeigth: "100%",
    background: "white",
    padding: "4rem",
    overflow: "hidden",
    position: "sticky",
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
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [currLocation]);

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
        <Container className={classes.containerStyles}>
          <Spinner />
        </Container>
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
                  disabled={!developer.websites.github}
                  aria-label="github"
                  size="small"
                  href={developer.websites.github}
                  target="_blank"
                >
                  <Tooltip title="github">
                    <GitHubIcon style={{ fontSize: "1.7rem" }} />
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
                    <LinkedInIcon style={{ fontSize: "1.7rem" }} />
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
                    <HttpIcon style={{ fontSize: "1.7rem" }} />
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
                    <AssignmentIndIcon style={{ fontSize: "1.7rem" }} />
                  </Tooltip>
                </IconButton>
              </Grid>
            </Grid>
          </Hidden>
          <Hidden smDown>
            <Grid item xs={3} className={classes.profile}>
              <div
                style={{
                  position: "fixed",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Grid container direction="column">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: ".5rem",
                    }}
                  >
                    <Avatar style={{ fontSize: "1.4rem", margin: ".3rem" }}>
                      {developer.name.charAt(0)}
                    </Avatar>
                    <Typography
                      color="textSecondary"
                      style={{ margin: ".1rem 0" }}
                    >
                      @{developer.username}
                    </Typography>
                  </div>
                  <Typography className={classes.userField}>
                    <b>Name: </b>
                    {developer.name}
                  </Typography>
                  <Typography className={classes.userField}>
                    <b style={{ marginRight: ".3rem" }}> Email:</b>
                    {developer.email}
                  </Typography>
                </Grid>
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
                <Grid container direction="row">
                  <IconButton
                    disabled={!developer.websites.github}
                    aria-label="github"
                    size="small"
                    href={developer.websites.github}
                    target="_blank"
                  >
                    <Tooltip title="github">
                      <GitHubIcon style={{fontSize: '1.2rem'}}/>
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
                      <LinkedInIcon style={{fontSize: '1.2rem'}}/>
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
                      <HttpIcon style={{fontSize: '1.2rem'}}/>
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
                      <AssignmentIndIcon style={{fontSize: '1.2rem'}}/>
                    </Tooltip>
                  </IconButton>
                </Grid>
              </div>
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
            <Typography component="h2" variant="h4" style={{ width: "100%" }}>
              Projects
            </Typography>
            <Grid container item direction="row" xs={12}>
              {!!developer.projects.length ? (
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

export default DevPage;
