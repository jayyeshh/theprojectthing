import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
  Button,
  CardActions,
  Avatar,
  makeStyles,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  followUser,
  unfollowUser,
} from "../../utility/utilityFunctions/ApiCalls";
import { setupAuthentication } from "../../actions/authActions";
import { setModalStateAction } from "../../actions/modalActions";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: ".8rem",
    minHeight: "15rem",
    "&:hover": {
      cursor: "pointer",
      boxShadow: "5px 20px 12px",
    },
    [theme.breakpoints.down("sm")]: {
      margin: ".4rem",
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

const DevCard = ({ profile, isAuthenticated, as, username, ...props }) => {
  const classes = useStyles();
  const history = useHistory();
  if (!!!profile.projects) return <></>;
  const follow = (uid) => {
    followUser(uid)
      .then((res) => {
        props.refresh(true);
        props.setModalState(
          true,
          `You are now following ${profile.username}`,
          "success"
        );
        setupAuthentication();
      })
      .catch((_error) => {
        props.setModalState(
          true,
          "Something went wrong! try again after some time",
          "error"
        );
        setupAuthentication();
      });
  };

  const unfollow = (uid) => {
    unfollowUser(uid)
      .then((_res) => {
        props.refresh(false);
        props.setModalState(true, `unfollowed ${profile.username}`, "info");
        setupAuthentication();
      })
      .catch((_error) => {
        props.setModalState(
          true,
          "Something went wrong! try again after some time",
          "error"
        );
        setupAuthentication();
      });
  };

  return (
    <Card
      className={classes.root}
      onClick={(e) => {
        if (!["FOLLOW", "UNFOLLOW"].includes(e.target.innerText)) {
          history.push(`/dev/${profile.username}`);
        }
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
        {profile.avatar ? (
          <Avatar className={classes.avatarStyles} src={profile.avatar}>
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
    setModalState: (modalState, text, severity) =>
      dispatch(setModalStateAction({ showModal: modalState, text, severity })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DevCard);
