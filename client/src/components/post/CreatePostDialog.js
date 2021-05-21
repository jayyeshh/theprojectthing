import React, { useState } from "react";
import axios from "../../utility/axios/apiInstance";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import { ADD_NEW_POST } from "../../actions/action-types";
import { setModalStateAction } from "../../actions/modalActions";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  fieldStyles: {
    marginBottom: ".4rem",
  },
}));

const CreatePostDialog = ({ open, close, ...props }) => {
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
        close();
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
    <Dialog open={open} onClose={close} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create New Post</DialogTitle>
      <DialogContent>
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
          id="title"
          label="text"
          placeholder="text(required)"
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Cancel
        </Button>
        <Button onClick={addPost} color="primary">
          {loading ? <CircularProgress size={20} /> : "Post"}
        </Button>
      </DialogActions>
    </Dialog>
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

export default connect(null, mapDispatchToProps)(CreatePostDialog);
