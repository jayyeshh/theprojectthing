import React from "react";
import {
  Grid,
  Card,
  Avatar,
  Typography,
  CardContent,
  CardActionArea,
  makeStyles,
} from "@material-ui/core";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "1rem",
    height: "15rem",
    "&:hover": {
      cursor: "pointer",
      boxShadow: "5px 20px 12px",
    },
  },
  actionBtn: {},
  avatarStyles: {
    fontSize: "1.4rem",
    margin: ".3rem",
    width: theme.spacing(8),
    height: theme.spacing(8),
    margin: "1rem",
  },
  blankAvatarStyles: {
    fontSize: "1.4rem",
    margin: ".3rem",
    width: theme.spacing(7),
    height: theme.spacing(7),
    margin: "1rem",
  },
}));

const CompanyCard = ({ profile, setError }) => {
  const classes = useStyles();
  const history = useHistory();
  if (!!!profile.posts) return <></>;
  return (
    <Card
      className={classes.root}
      onClick={(e) => {
        history.push(`/company/${profile.username}`);
      }}
    >
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{
          borderBottom: "1px solid #cbd6ce",
          minHeight: "5rem",
        }}
      >
        {profile.logo ? (
          <Avatar className={classes.avatarStyles} src={profile.logo}>
            {profile.name.charAt(0)}
          </Avatar>
        ) : (
          <Avatar className={classes.blankAvatarStyles}>
            {profile.name.charAt(0)}
          </Avatar>
        )}
      </Grid>

      <CardActionArea>
        <CardContent>
          <Typography color="textSecondary">@{profile.username}</Typography>
          <Typography style={{ fontWeight: 500, fontSize: "1.2rem" }}>
            {profile.name}
          </Typography>
          <Grid container direction="row">
            <Typography style={{ fontWeight: 600 }}>Posts:</Typography>
            <Typography>{profile.posts.length}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography style={{ fontWeight: 600 }}>Reviews:</Typography>
            <Typography>{profile.reviews.length}</Typography>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CompanyCard;
