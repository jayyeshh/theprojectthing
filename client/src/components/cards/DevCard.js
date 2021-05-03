import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
  Button,
  CardActions,
  CardHeader,
  Avatar,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  followUser,
  unfollowUser,
} from "../../utility/utilityFunctions/ApiCalls";
import { setupAuthentication } from "../../actions/authActions";
import { setModalStateAction } from "../../actions/modalActions";

const useStyles = makeStyles({
  root: {
    margin: "1rem",
    minHeight: "15rem",
    "&:hover": {
      cursor: "pointer",
      boxShadow: "5px 20px 12px",
    },
  },
  actionBtn: {},
});

const DevCard = ({ profile, isAuthenticated, as, username, ...props }) => {
  const classes = useStyles();
  const history = useHistory();
  if (!!!profile.projects) return <></>;
  const follow = (uid) => {
    followUser(uid)
      .then((res) => {
        props.refresh(true);
        props.setModalState(true, `You are now following ${profile.username}`);
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
        setupAuthentication();
      })
      .catch((_error) => {
        props.setModalState(
          true,
          "Something went wrong! try again after some time"
        );
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
        setupAuthentication();
      });
  };

  const unfollow = (uid) => {
    unfollowUser(uid)
      .then((res) => {
        props.refresh(false);
        props.setModalState(true, `unfollowed ${profile.username}`);
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
        setupAuthentication();
      })
      .catch((_error) => {
        props.setModalState(
          true,
          "Something went wrong! try again after some time"
        );
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
        setupAuthentication();
      });
  };

  return (
    <Card
      className={classes.root}
      onClick={(e) => {
        if (!["FOLLOW", "UNFOLLOW"].includes(e.target.innerText)) {
          history.push(`/dev/${profile._id}`);
        }
      }}
    >
      <CardHeader
        style={{
          borderBottom: "1px solid #cbd6ce",
          display: "flex",
          flexDirection: "column",
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
            <Typography style={{ fontWeight: 600 }}>
              Total Projects:{" "}
            </Typography>
            <Typography>{profile.projects.length}</Typography>
          </Grid>
        </CardContent>
      </CardActionArea>
      {isAuthenticated &&
        as.toLowerCase() === "developer" &&
        profile.username !== username && (
          <CardActions>
            {profile.follows ? (
              <Button
                className={classes.actionBtn}
                variant="contained"
                color="default"
                onClick={() => unfollow(profile._id)}
              >
                Unfollow
              </Button>
            ) : (
              <Button
                className={classes.actionBtn}
                variant="contained"
                color="primary"
                onClick={() => follow(profile._id)}
              >
                Follow
              </Button>
            )}
          </CardActions>
        )}
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.authReducer.authenticated,
    as: state.authReducer.as,
    username: state.authReducer.user.username,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setModalState: (modalState, text) =>
      dispatch(setModalStateAction({ showModal: modalState, text })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DevCard);
