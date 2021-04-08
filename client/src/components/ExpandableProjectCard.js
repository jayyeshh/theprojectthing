import { Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import {
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Card,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { NavLink } from "react-router-dom";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import moment from "moment";

const defaultImage =
  "https://safetyaustraliagroup.com.au/wp-content/uploads/2019/05/image-not-found.png";

const useStyles = makeStyles((theme) => ({
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
}));

const ExpandableProjectCard = ({ project }) => {
  console.log(project);
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      <Card className={classes.root}>
        <NavLink
          to={`/projects/${project._id}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <CardHeader
            title={project.title}
            subheader={`Posted on: ${moment(project.createdAt).format(
              "MMM Do YY,hh:mm a"
            )}`}
          />
        </NavLink>
        <CardMedia
          className={classes.media}
          image={!!project.photo ? project.photo : defaultImage}
          title={project.title}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {project.about}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <ExpandLessIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
      </Card>
    </div>
  );
};

export default ExpandableProjectCard;
