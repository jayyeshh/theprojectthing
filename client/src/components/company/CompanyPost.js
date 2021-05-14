import React, { useEffect, useState } from "react";
import {
  IconButton,
  Grid,
  Typography,
  Menu,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import ExposureNeg1Icon from "@material-ui/icons/ExposureNeg1";
import ExposurePlus1OutlinedIcon from "@material-ui/icons/ExposurePlus1Outlined";
import { connect } from "react-redux";
import axios from "../../utility/axios/apiInstance";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useConfirm } from "material-ui-confirm";
import { deleteCompanyPost } from "../../utility/utilityFunctions/ApiCalls";

const useStyles = makeStyles((theme) => ({
  listviewerBtn: {
    "&:hover": {
      cursor: "pointer",
      color: "#616151",
    },
  },
  mainPostContainer: {
    // minWidth: "60%",
    maxWidth: "80%",
    background: "#fff",
    margin: ".4rem",
    marginBottom: "1.5rem",
    [theme.breakpoints.down("xs")]: {
      // minWidth: "75%",
    },
  },
  title: {
    fontWeight: 500,
    fontFamily: "Noto Sans JP",
    fontSize: "1.2rem",
  },
  body: {
    width: "100%",
    wordWrap: "break-word",
  },
}));

const options = ["delete"];

const ITEM_HEIGHT = 48;

const CompanyPost = ({ post, removePost, ...props }) => {
  const classes = useStyles();
  const [authedDevInteresed, setAuthedDevInterested] = useState(false);
  const confirmation = useConfirm();
  useEffect(() => {
    let checkState = false;
    if (props.authedAs) {
      checkState = post.interested.some((item) => {
        if (typeof item === "string") {
          return item.toString() === props.uid.toString();
        } else if (typeof item === "object" && item !== null) {
          return item._id.toString() === props.uid.toString();
        }
      });
      setAuthedDevInterested(checkState);
    } else {
      setAuthedDevInterested(checkState);
    }
  }, [post, post.interested.length]);
  const markInterested = () => {
    const configs = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    axios
      .post("/post/interested/", { postId: post._id }, configs)
      .then((resp) => {
        props.updatePost(resp.data.post);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (option) => {
    if (option === "delete") {
      confirmation({
        description: "This Post will be deleted permanently!",
        confirmationText: "Delete",
        confirmationButtonProps: { color: "secondary" },
      })
        .then(() => {
          deleteCompanyPost(post._id)
            .then((res) => {
              removePost();
              props.setModalState(true, "Post Deleted!");
              setTimeout(() => {
                props.setModalState(false, "");
              }, 3000);
            })
            .catch((error) => {
              props.setModalState(
                true,
                "Something went wrong! Try again later!"
              );
              setTimeout(() => {
                props.setModalState(false, "");
              }, 3000);
              console.log("[error]: ", error);
            });
          handleClose();
        })
        .catch((error) => {
          handleClose();
        });
    }
  };

  return (
    <Grid
      item
      xs={12}
      container
      direction="column"
      alignItems="flex-start"
      className={classes.mainPostContainer}
    >
      <Grid
        container
        direction="column"
        alignItems="flex-start"
        style={{ textAlign: "left", padding: "1rem", whiteSpace: "pre-wrap" }}
      >
        <Grid container>
          <Grid item xs={11}>
            <Typography className={classes.title}>{post.title}</Typography>
          </Grid>
          <Grid item xs={1} container justify="flex-end">
            {!!props.uid && props.uid === post.author._id && (
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
            )}
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: "20ch",
                },
              }}
            >
              {options.map((option) => (
                <MenuItem
                  key={option}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </Grid>
        </Grid>
        <Typography className={classes.body}>{post.body}</Typography>
      </Grid>
      <Grid
        style={{
          display: "flex",
          flexDirection: "row",
          borderTop: "1px solid #aaa",
          maxHeight: "2rem",
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          margin: 0,
          padding: 0,
          borderRadius: 0,
        }}
      >
        <IconButton
          disabled={
            !props.authedAs || props.authedAs.toLowerCase() !== "developer"
          }
          color={authedDevInteresed ? "secondary" : "primary"}
          aria-label="interested"
          onClick={() => markInterested()}
        >
          {authedDevInteresed ? (
            <ExposureNeg1Icon style={{ fontSize: "1.3rem" }} />
          ) : (
            <ExposurePlus1OutlinedIcon style={{ fontSize: "1.3rem" }} />
          )}
        </IconButton>
        <Typography
          onClick={() => props.handleShowInterestedDevs(props.index)}
          className={classes.listviewerBtn}
        >
          {post.interested.length}
        </Typography>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    authedAs: state.authReducer.as,
    uid: state.authReducer.user._id,
  };
};

export default connect(mapStateToProps, null)(CompanyPost);
