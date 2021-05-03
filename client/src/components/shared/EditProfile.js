import React, { useState, useEffect } from "react";
import { SETUP_PROFILE } from "../../actions/action-types";
import PropTypes from "prop-types";
import {
  Grid,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
  Box,
  Avatar,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { setModalStateAction } from "../../actions/modalActions";
import { green } from "@material-ui/core/colors";
import InputField from "../forms/InputField";
import axios from "../../utility/axios/apiInstance";
import { logoutAction } from "../../actions/authActions";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    backgroundColor: "#eee",
    minWidth: "90vw",
    minHeight: "90vh",
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      height: "100%",
    },
  },
  subContainer: {
    margin: "2rem 4rem",
    [theme.breakpoints.down("xs")]: {
      margin: 0,
    },
  },
  editProfileContainer: {
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      minWidth: "90%",
    },
  },
  sideMenuBtnStyles: {
    borderBottom: "1px solid #e1e1e1",
  },
  formGrid: {
    display: "flex",
    alignSelf: "center",
    width: "50%",
    margin: "2rem 0",
    [theme.breakpoints.down("xs")]: {
      width: "90%",
    },
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    width: "100%",
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  buttonProgress: {
    color: green[500],
  },
}));

const initialEditProfileFields = {
  username: "",
  name: "",
  about: "",
  email: "",
  website: "",
  linkedIn: "",
  technologies: "",
  github: "",
  portfolio: "",
};

const initialEditProfileErrors = {
  username: false,
  name: false,
  about: false,
  email: false,
  website: false,
  technologies: false,
  linkedIn: false,
  github: false,
  portfolio: false,
};

const EditProject = ({ profile, ...props }) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [changingPassword, setChangingPassword] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [passwordChangeFields, setPasswordChangeFields] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [editProfileFields, setEditProfileFields] = useState(
    initialEditProfileFields
  );
  useEffect(() => {
    const values = { ...profile };
    if (values.technologies) {
      values.technologies = values.technologies.join(", ");
    }
    setEditProfileFields(values);
  }, []);

  const [editProfileErrors, setEditProfileErrors] = useState(
    initialEditProfileErrors
  );

  const [passwordFieldsErrors, setPaswordFieldsErrors] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const passwordFieldsChangeHandler = (e) => {
    passwordFieldsErrors[e.target.name] = false;
    setPasswordChangeFields({
      ...passwordChangeFields,
      [e.target.name]: e.target.value,
    });
  };

  const editProfileFieldsChangeHandler = (e) => {
    editProfileErrors[e.target.name] = false;
    setEditProfileFields({
      ...editProfileFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const updateProfile = (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    const configs = {
      headers: {
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    const url = `/${props.authedAs.toLowerCase()}`;
    const {
      username,
      name,
      email,
      about,
      website,
      technologies,
      linkedIn,
      github,
      portfolio,
    } = editProfileFields;
    const payload = {
      username,
      name,
      email,
      website,
      about,
      linkedIn,
      github,
      portfolio,
    };
    if (props.authedAs.toLowerCase() === "company") {
      const technologiesArray = technologies
        .split(",")
        .map((tech) => tech.trim());
      payload.technologies = technologiesArray;
    }
    axios
      .patch(url, payload, configs)
      .then((resp) => {
        setUpdatingProfile(false);
        props.setModalState(true, "Profile Updated!");
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
        props.updateLocalProfile({
          profile: resp.data.profile,
          as: props.authedAs,
        });
      })
      .catch((error) => {
        console.log(error);
        setUpdatingProfile(false);
        if (error.response && error.response.data) {
          props.setModalState(true, error.response.data.error);
        } else {
          props.setModalState(true, "Something went wrong! Try again later.");
        }
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
      });
  };

  const changePassword = () => {
    setChangingPassword(true);
    const { oldPassword, newPassword, confirmPassword } = passwordChangeFields;
    if (!oldPassword || !newPassword || !confirmPassword) {
      return setChangingPassword(false);
    }
    if (newPassword !== confirmPassword) {
      setChangingPassword(false);
      setPaswordFieldsErrors({
        oldPassword: false,
        newPassword: true,
        confirmPassword: true,
      });
      props.setModalState(
        true,
        "new password and confirm password does not match"
      );
      setTimeout(() => {
        props.setModalState(false, "");
      }, 3000);
      return;
    }
    setPaswordFieldsErrors({
      oldPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
    const payload = {
      oldPassword,
      newPassword,
    };
    const configs = {
      headers: {
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    axios
      .patch("/password", payload, configs)
      .then((resp) => {
        setChangingPassword(false);
        props.setModalState(true, "Password Changed!");
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
        props.logout();
      })
      .catch((error) => {
        setChangingPassword(false);
        if (error.response && error.response.data) {
          setPaswordFieldsErrors({
            oldPassword: !!error.response.data.oldPassword,
            newPassword: !!error.response.data.newPassword,
            confirmPassword: !!error.response.data.confirmPassword,
          });
          if (error.response.data.oldPassword) {
            props.setModalState(true, error.response.data.oldPassword);
            setTimeout(() => {
              props.setModalState(false, "");
            }, 3000);
          }
          if (error.response.data.message) {
            props.setModalState(true, error.response.data.message);
            setTimeout(() => {
              props.setModalState(false, "");
            }, 3000);
          }
          return;
        }
        props.setModalState(true, "Something went wrong! Try again later.");
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
      });
  };

  return (
    <Grid
      container
      direction="row"
      align="center"
      justify="center"
      className={classes.mainContainer}
    >
      <Grid
        container
        direction="row"
        justify="center"
        className={classes.subContainer}
      >
        <Grid
          item
          sm={2}
          xs={4}
          container
          direction="column"
          align="flex-start"
          alignItems="flex-start"
          justify="flex-start"
          style={{
            backgroundColor: "#fff",
            textAlign: "left",
          }}
        >
          <Grid className={classes.root}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Side Edit Menus"
              className={classes.tabs}
            >
              <Tab label="Edit Profile" {...a11yProps(0)} />
              <Tab label="Change Password" {...a11yProps(1)} />
            </Tabs>
          </Grid>
        </Grid>
        <Grid
          item
          xs={8}
          container
          direction="column"
          style={{
            backgroundColor: "#fff",
            overflowY: "auto",
            padding: "1rem 0",
            overflowX: "hidden",
          }}
        >
          <TabPanel value={value} index={0}>
            <Grid>
              <Avatar>{profile.username.charAt(0)}</Avatar>
              <Typography style={{ marginTop: ".3rem" }}>
                {profile.username}
              </Typography>
            </Grid>
            <Grid
              item
              xs={8}
              container
              direction="column"
              className={classes.editProfileContainer}
            >
              <form onSubmit={updateProfile}>
                <InputField
                  labelText="Username"
                  id="username"
                  required={true}
                  type="text"
                  error={editProfileErrors.username}
                  value={editProfileFields.username}
                  onChangeHandler={editProfileFieldsChangeHandler}
                />
                <InputField
                  labelText="Name"
                  id="name"
                  type="text"
                  required={true}
                  error={editProfileErrors.name}
                  value={editProfileFields.name}
                  onChangeHandler={editProfileFieldsChangeHandler}
                />
                <InputField
                  labelText="Email"
                  id="email"
                  type="email"
                  required={true}
                  error={editProfileErrors.email}
                  value={editProfileFields.email}
                  onChangeHandler={editProfileFieldsChangeHandler}
                />
                {props.authedAs &&
                  props.authedAs.toLowerCase() === "company" && (
                    <InputField
                      labelText="Technologies(*comma separated)"
                      id="technologies"
                      type="text"
                      placeholder="eg: javascript, python..."
                      error={editProfileErrors.technologies}
                      value={editProfileFields.technologies}
                      onChangeHandler={editProfileFieldsChangeHandler}
                    />
                  )}

                <InputField
                  labelText="website"
                  id="website"
                  type="url"
                  error={editProfileErrors.website}
                  value={editProfileFields.website}
                  onChangeHandler={editProfileFieldsChangeHandler}
                />
                <InputField
                  labelText="LinkedIn"
                  id="linkedIn"
                  type="url"
                  error={editProfileErrors.linkedIn}
                  value={editProfileFields.linkedIn}
                  onChangeHandler={editProfileFieldsChangeHandler}
                />
                {props.authedAs.toLowerCase() === "company" && (
                  <InputField
                    labelText="About"
                    id="about"
                    type="text"
                    placeholder="about(*max 150 letters)"
                    error={editProfileErrors.about}
                    value={editProfileFields.about}
                    onChangeHandler={editProfileFieldsChangeHandler}
                  />
                )}
                {props.authedAs.toLowerCase() === "developer" && (
                  <>
                    <InputField
                      labelText="Github"
                      id="github"
                      type="url"
                      error={editProfileErrors.github}
                      value={editProfileFields.github}
                      onChangeHandler={editProfileFieldsChangeHandler}
                    />
                    <InputField
                      labelText="portfolio"
                      id="portfolio"
                      type="url"
                      error={editProfileErrors.portfolio}
                      value={editProfileFields.portfolio}
                      onChangeHandler={editProfileFieldsChangeHandler}
                    />
                  </>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={updatingProfile}
                  // onClick={() => updateProfile()}
                  style={{ marginTop: "1rem", width: "100%" }}
                >
                  {updatingProfile ? (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  ) : (
                    "Update"
                  )}
                </Button>
              </form>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Grid
              container
              direction="column"
              align="center"
              justify="center"
              alignContent="center"
            >
              <Grid item xs={12} container direction="row" justify="center">
                <Avatar>{profile.username.charAt(0)}</Avatar>
                <Typography
                  style={{
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: ".7rem",
                  }}
                >
                  {profile.username}
                </Typography>
              </Grid>
              <Grid
                container
                direction="column"
                alignItems="center"
                component="form"
                className={classes.formGrid}
                noValidate
              >
                <InputField
                  labelText="Old Password"
                  id="oldPassword"
                  type="password"
                  error={passwordFieldsErrors.oldPassword}
                  value={passwordChangeFields.oldPassword}
                  onChangeHandler={passwordFieldsChangeHandler}
                />
                <InputField
                  labelText="New Password"
                  id="newPassword"
                  type="password"
                  error={passwordFieldsErrors.newPassword}
                  value={passwordChangeFields.newPassword}
                  onChangeHandler={passwordFieldsChangeHandler}
                />
                <InputField
                  labelText="Confirm Password"
                  id="confirmPassword"
                  type="password"
                  error={passwordFieldsErrors.confirmPassword}
                  value={passwordChangeFields.confirmPassword}
                  onChangeHandler={passwordFieldsChangeHandler}
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={
                    !!!passwordChangeFields.oldPassword ||
                    !!!passwordChangeFields.newPassword ||
                    !!!passwordChangeFields.confirmPassword ||
                    changingPassword
                  }
                  onClick={() => changePassword()}
                  style={{ marginTop: "1rem", width: "100%" }}
                >
                  {changingPassword ? (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </Grid>
            </Grid>
          </TabPanel>
        </Grid>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    profile: state.authReducer.user,
    authedAs: state.authReducer.as,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setModalState: (modalState, text) =>
      dispatch(setModalStateAction({ showModal: modalState, text })),
    updateLocalProfile: ({ profile, as }) =>
      dispatch({
        type: SETUP_PROFILE,
        payload: {
          profile,
          as,
        },
      }),
    logout: () => dispatch(logoutAction()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProject);
