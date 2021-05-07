import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import CodeIcon from "@material-ui/icons/Code";

const useStyles = makeStyles({
  root: {
    minHeight: 300,
    margin: "1rem",
    "&:hover": {
      boxShadow: "5px 20px 12px",
    },
  },
});
const defaultImage =
  "https://safetyaustraliagroup.com.au/wp-content/uploads/2019/05/image-not-found.png";

const truncate = (str = "") =>
  str.length > 20 ? str.substr(0, 17) + "..." : str;
const onMediaFallback = (event) => {
  event.target.src = defaultImage;
};

const ProjectCard = ({ project }) => {
  const classes = useStyles();
  const history = useHistory();
  const [frontFace, setFrontFace] = useState(null);

  useEffect(() => {
    if (project.photos && project.photos.length) {
      const gif = project.photos.find((photo) => photo.endsWith(".gif"));
      if (gif) setFrontFace(gif);
      else setFrontFace(project.photos[0]);
    }
  }, []);
  if (!!!project.title) return <></>;
  return (
    <Card className={classes.root}>
      <CardActionArea onClick={() => history.push(`/projects/${project._id}`)}>
        <CardMedia
          component="img"
          alt="project snapshot"
          height="140"
          image={!!frontFace ? frontFace : defaultImage}
          onError={onMediaFallback}
          title={project.title}
        />
        <CardContent>
          <Typography
            style={{ overflow: "hidden", textOverflow: "ellipsis" }}
            gutterBottom
            variant="h5"
            component="h2"
          >
            {truncate(project.title)}
          </Typography>
          {!!project.about && (
            <Typography variant="body2" color="textSecondary" component="p">
              {truncate(project.about)}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          onClick={() => window.open(project.links.github, "_blank")}
          size="small"
          color="primary"
          disabled={!(project.links && project.links.github)}
        >
          <CodeIcon />
        </Button>
        <Button
          onClick={() => window.open(project.links.site, "_blank")}
          size="small"
          color="primary"
          disabled={!(project.links && project.links.site)}
        >
          View
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
