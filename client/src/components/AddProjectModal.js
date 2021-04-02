import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import { makeStyles } from "@material-ui/core/styles";
import AddProject from "./AddProject";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const AddProjectModal = (props) => {
  const classes = useStyles();
  return (
    <Modal
      aria-labelledby="Add Project"
      className={classes.modal}
      open={props.showAddProjectModal}
      onClose={props.toggleAddProjectModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.showAddProjectModal}>
        <div className={classes.paper}>
          <AddProject />
        </div>
      </Fade>
    </Modal>
  );
};

export default AddProjectModal;
