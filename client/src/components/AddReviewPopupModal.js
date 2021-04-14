import {
  Grid,
  Button,
  Modal,
  TextareaAutosize,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import axios from "../utility/axios/apiInstance";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "40%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
    borderRadius: "3px",
    padding: theme.spacing(2, 4, 3),
    transition: "all .6s ease-in-out",
    padding: "1rem 2rem",
    [theme.breakpoints.down("xs")]: {
      width: "90%",
    },
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "81%",
    left: "48%",
  },
}));

const AddReviewPopupModal = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  const textChangeHandler = (e) => {
    setText(e.target.value);
  };

  const submitReview = () => {
    setLoading(true);
    const configs = {
      headers: {
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    axios
      .post("/review", { text, companyId: props.companyId }, configs)
      .then((resp) => {
        setText("");
        setLoading(false);
        props.updateReviews(resp.data.review);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error: ", error);
      });
  };

  return (
    <Grid>
      <Modal
        open={props.addReviewPopup}
        onClose={() => props.setAddReviewPopup(false)}
        aria-labelledby="add review popup"
        aria-describedby="add review popup"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
        }}
      >
        <Grid
          container
          align="center"
          direction="column"
          justify="center"
          className={classes.paper}
        >
          <Typography style={{}} variant="h5">
            Add Review
          </Typography>
          <TextareaAutosize
            aria-label="review"
            placeholder="write review here..."
            rowsMin={6}
            rowsMax={6}
            value={text}
            onChange={textChangeHandler}
            style={{
              margin: ".8rem 0",
              padding: ".4rem",
            }}
          />
          <Button
            color="primary"
            variant="contained"
            disabled={loading}
            style={{
              width: "100%",
            }}
            onClick={submitReview}
          >
            Submit
          </Button>
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Grid>
      </Modal>
    </Grid>
  );
};

export default AddReviewPopupModal;
