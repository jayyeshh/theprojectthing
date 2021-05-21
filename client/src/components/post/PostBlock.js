import {
  CircularProgress,
  Button,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "../../utility/axios/apiInstance";
import React, { useState } from "react";
import { setModalStateAction } from "../../actions/modalActions";
import { green } from "@material-ui/core/colors";
import { connect } from "react-redux";
import { ADD_NEW_POST } from "../../actions/action-types";

const useStyles = makeStyles((theme) => ({
  buttonProgress: {
    color: green[500],
  },
  postBlockContainer: {
    marginTop: "2rem",
    borderRadius: "2px",
    padding: ".8rem",
    backgroundColor: "#ddd",
    width: "70%",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      margin: 0,
      justifyContent: "center",
      marginTop: "1rem",
    },
  },
  fieldStyles: {
    marginBottom: ".4rem",
  },
  btnStyles: {
    marginTop: ".4rem",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      justifyContent: "center",
    },
  },
}));

const PostBlock = (props) => {
  const [values, setValues] = useState({
    title: "",
    body: "",
    tags: [],
  });
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
      .post("/post/", values, configs)
      .then((resp) => {
        clearFields();
        setLoading(false);
        props.addNewPost(resp.data);
        props.setModalState(true, "post added", "success");
      })
      .catch((error) => {
        let errorText = "Something went wrong! Try again later.";
        if (error.response) {
          errorText = error.response.data.error;
        }
        props.setModalState(true, errorText, "error");
        setLoading(false);
      });
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const clearFields = () => {
    setValues({
      title: "",
      body: "",
      tags: [],
    });
  };

  return (
    <Grid
      item
      sm={9}
      xs={12}
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      className={classes.postBlockContainer}
    >
      <Typography
        style={{
          marginBottom: ".4rem",
          fontWeight: 500,
          fontFamily: "Noto Sans JP",
          fontSize: "1.2rem",
        }}
      >
        Create Post
      </Typography>
      <TextField
        autoComplete="title"
        name="title"
        value={values.title}
        variant="standard"
        onChange={onChangeHandler}
        className={classes.fieldStyles}
        required
        fullWidth
        placeholder="Title"
        id="title"
        label="Post Title"
      />
      <TextField
        autoComplete="body"
        multiline
        rows={4}
        name="body"
        value={values.body}
        className={classes.fieldStyles}
        variant="standard"
        onChange={onChangeHandler}
        required
        fullWidth
        id="body"
        label="text"
        placeholder="text(required)"
        required
      />
      <Grid className={classes.btnStyles}>
        <Button
          disabled={loading || !values.title || !values.body}
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
          onClick={clearFields}
        >
          clear
        </Button>
      </Grid>
    </Grid>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setModalState: (modalState, text, severity) =>
      dispatch(setModalStateAction({ showModal: modalState, text, severity })),
    addNewPost: (post) => {
      dispatch({ type: ADD_NEW_POST, payload: { post } });
    },
  };
};

export default connect(null, mapDispatchToProps)(PostBlock);
