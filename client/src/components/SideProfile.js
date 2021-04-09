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

const SideProfile = ({
  as,
  user,
  projects = [],
  posts = [],
  isAuthed = false,
}) => {
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
        {as.toLowerCase() === "developer" && (
          <CardActionArea style={{ borderTop: "1px solid #abb0ac" }}>
            <CardContent style={{ display: "flex", flexDirection: "column" }}>
              <NavLink to="/followers" className={classes.linkStyles}>
                <Typography style={{ marginLeft: ".4rem" }} component="p">
                  Followers: {user.followers}
                </Typography>
              </NavLink>
              <NavLink to="/followings" className={classes.linkStyles}>
                <Typography style={{ marginLeft: ".4rem" }} component="p">
                  Following: {user.following}
                </Typography>
              </NavLink>
            </CardContent>
          </CardActionArea>
        )}

        {as.toLowerCase() === "developer" && (
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
        {as.toLowerCase() === "company" && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Posts</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List
                component="nav"
                className={classes.listStyles}
                aria-label="Posts"
              >
                {posts.map((post) => (
                  <NavLink
                    to={"/post/" + post._id}
                    className={classes.linkStyles}
                    key={post._id}
                  >
                    <ListItem button divider>
                      <ListItemText
                        primary={
                          post.text.length > 10
                            ? post.text.substr(7) + "..."
                            : post.text
                        }
                      />
                    </ListItem>
                  </NavLink>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {isAuthed && (
          <CardActions>
            <NavLink to="/profile/edit" style={{ textDecoration: "none" }}>
              <Button size="small" color="primary">
                Edit Profile
              </Button>
            </NavLink>
          </CardActions>
        )}
      </Card>
    </Paper>
  );
};

export default SideProfile;
