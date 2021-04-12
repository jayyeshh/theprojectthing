import {
  CircularProgress,
  Button,
  Grid,
  TextareaAutosize,
  makeStyles,
} from "@material-ui/core";
import axios from "../utility/axios/apiInstance";
import React, { useState } from "react";
import { setModalStateAction } from "../actions/modalActions";
import { green } from "@material-ui/core/colors";
import { connect } from "react-redux";
import { ADD_NEW_POST } from "../actions/action-types";

const useStyles = makeStyles({
  buttonProgress: {
    color: green[500],
  },
});

const PostBlock = (props) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const addPost = () => {
    setLoading(true);
    const configs = {
      headers: {
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    axios
      .post("/post/", { text }, configs)
      .then((resp) => {
        setText("");
        setLoading(false);
        props.addNewPost(resp.data);
        props.setModalState(true, "post added");
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
      })
      .catch((error) => {
        let errorText = "Something went wrong! Try again later.";
        if (error.response) {
          errorText = error.response.data.error;
        }
        props.setModalState(true, errorText);
        setLoading(false);
        setTimeout(() => {
          props.setModalState(false, "");
        }, 3000);
      });
  };

  return (
    <Grid container item xs={12}>
      <Grid item container xs={12}>
        <TextareaAutosize
          rowsMin={4}
          rowsMax={4}
          cols={60}
          aria-label="post input box"
          placeholder="write post..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            margin: "0 2rem",
            padding: ".8rem",
            backgroundColor: "#eee",
            transition: "all .6s ease-in-out",
            outlineWidth: ".4px",
            border: "none",
            "&::focus": {
              backgroundColor: "#fff",
            },
          }}
        />
      </Grid>
      <Grid
        item
        container
        xs={12}
        style={{
          margin: ".6rem 2rem",
        }}
      >
        <Button
          disabled={loading}
          variant="contained"
          color="primary"
          onClick={addPost}
        >
          {loading ? (
            <CircularProgress size={14} className={classes.buttonProgress} />
          ) : (
            "POST"
          )}
        </Button>
        <Button
          variant="contained"
          style={{
            margin: "0 .7rem",
          }}
          onClick={() => setText("")}
        >
          clear
        </Button>
      </Grid>
    </Grid>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setModalState: (modalState, text) =>
      dispatch(setModalStateAction({ showModal: modalState, text })),
    addNewPost: (post) => {
      dispatch({ type: ADD_NEW_POST, payload: { post } });
    },
  };
};

export default connect(null, mapDispatchToProps)(PostBlock);
