import { Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { CardHeader, CardContent, CardMedia, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import moment from "moment";

const defaultImage =
  "https://safetyaustraliagroup.com.au/wp-content/uploads/2019/05/image-not-found.png";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    height: 300
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
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
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
        {project.about && (
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {project.about.length < 30
                ? project.about
                : project.about.substr(0, 27) + "..."}
            </Typography>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ExpandableProjectCard;
