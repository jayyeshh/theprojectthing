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

const Profile = ({ as, user, projects }) => {
  const classes = useStyles();
  return (
    <Paper style={{ marginRight: "1rem" }} elevation={14}>
      <Card className={classes.root}>
        <CardHeader
          style={{
            borderBottom: "1px solid #cbd6ce",
          }}
          avatar={
            <Avatar aria-label={user.username} className={classes.avatar}>
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={user.username}
          subheader={user.name}
        />
        <CardActionArea>
          <CardContent style={{ display: "flex" }}>
            <EmailIcon />
            <Typography style={{ marginLeft: ".4rem" }} component="p">
              {user.email}
            </Typography>
          </CardContent>
        </CardActionArea>
        {as === "Developer" && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Projects</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List
                component="nav"
                className={classes.listStyles}
                aria-label="Projects"
              >
                {projects.map((project) => (
                  <NavLink
                    to={"/projects/" + project._id}
                    className={classes.linkStyles}
                    key={project._id}
                  >
                    <ListItem button divider>
                      <ListItemText primary={project.title} />
                    </ListItem>
                  </NavLink>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}
        <CardActions>
          <NavLink to="/profile/edit" style={{ textDecoration: "none" }}>
            <Button size="small" color="primary">
              Edit Profile
            </Button>
          </NavLink>
        </CardActions>
      </Card>
    </Paper>
  );
};

const mapStateToProps = (state) => {
  return {
    as: state.authReducer.as,
    user: state.authReducer.user,
    projects: state.projectReducer.projects,
  };
};

export default connect(mapStateToProps)(Profile);
