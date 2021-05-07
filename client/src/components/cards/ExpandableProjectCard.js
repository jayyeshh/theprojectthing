import { Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { CardHeader, CardContent, CardMedia, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import moment from "moment";

const defaultImage =
  "https://safetyaustraliagroup.com.au/wp-content/uploads/2019/05/image-not-found.png";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    height: 300,
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
  const [frontShow, setFrontShow] = useState(null);

  useEffect(() => {
    if (project.photos && project.photos.length) {
      const gifFile = project.photos.find((photo) => photo.endsWith(".gif"));
      if (gifFile) {
        setFrontShow(gifFile);
      } else {
        setFrontShow(project.photos[0]);
      }
    }
  }, []);
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
              "MMM Do, YYYY,(hh:mm a)"
            )}`}
          />
        </NavLink>
        {frontShow ? (
          <CardMedia
            className={classes.media}
            image={frontShow}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
            title={project.title}
          />
        ) : (
          <CardMedia>
            <Grid
              container
              direction="row"
              justify="center"
              align="center"
              alignItems="center"
              style={{
                minWidth: "100%",
                minHeight: "10rem",
                backgroundColor: "#efefef",
                color: "#a1a1a1",
              }}
            >
              <Typography>no image found</Typography>
            </Grid>
          </CardMedia>
        )}
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
