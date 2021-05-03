import React from "react";
import {
  Grid,
  Card,
  CardHeader,
  Avatar,
  Typography,
  CardContent,
  CardActionArea,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";

const useStyles = makeStyles({
  root: {
    margin: "1rem",
    height: "15rem",
    "&:hover": {
      cursor: "pointer",
      boxShadow: "5px 20px 12px",
    },
  },
  actionBtn: {},
});

const CompanyCard = ({ profile, setError }) => {
  const classes = useStyles();
  const history = useHistory();
  if (!!!profile.posts) return <></>;
  return (
    <Card
      className={classes.root}
      onClick={(e) => {
        history.push(`/company/${profile._id}`);
      }}
    >
      <CardHeader
        style={{
          borderBottom: "1px solid #cbd6ce",
          display: "flex",
          flexDirection: "column",
          minHeight: '3rem'
        }}
        avatar={
          <Avatar aria-label={profile.username} className={classes.avatar}>
            {profile.username.charAt(0).toUpperCase()}
          </Avatar>
        }
      />
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
