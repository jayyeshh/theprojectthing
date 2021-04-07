import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  Button,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EmailIcon from "@material-ui/icons/Email";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import SideProfile from "./SideProfile";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  listStyles: {
    width: "100%",
    margin: 0,
    padding: 0,
    maxHeight: "20vh",
    overflowY: "auto",
  },
  linkStyles: {
    textDecoration: "none",
  },
}));

const Profile = ({ as, user, projects, isAuthed }) => {
  return (
    <SideProfile as={as} user={user} projects={projects} isAuthed={isAuthed} />
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthed: state.authReducer.authenticated,
    as: state.authReducer.as,
    user: state.authReducer.user,
    projects: state.projectReducer.projects,
  };
};

export default connect(mapStateToProps)(Profile);
