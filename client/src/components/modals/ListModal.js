import { Modal, Grid, Typography, Divider } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { useHistory, NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    width: "18rem",
    outline: "none",
    borderRadius: "5px",
    overflow: "hidden",
  },
  listItem: {
    width: "100%",
    margin: ".3rem 0",
    padding: ".3rem",
    overflowX: "hidden",
    transition: 'all ease-in-out .2s',
    "&:hover": {
      cursor: "pointer",
      paddingLeft: "1rem",
      background: "#eee",
    },
  },
}));

const ListModal = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const handleClose = () => {
    if (props.id) history.push(`/dev/${props.id}`);
    props.setShowModal(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="list modal"
        aria-describedby="list modal"
        className={classes.modal}
        open={props.showModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.showModal}>
          <Grid container className={classes.paper}>
            <Typography
              variant="h5"
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {props.title}
            </Typography>
            <Divider />
            <Grid
              container
              direction="row"
              align="flex-start"
              alignContent="flex-start"
              style={{
                margin: ".8rem 0",
                overflowX: "hidden",
                height: "15rem",
              }}
            >
              {props.list.map((item) => {
                return (
                  <Grid
                    item
                    xs={12}
                    key={item._id}
                    className={classes.listItem}
                  >
                    <NavLink
                      to={
                        !!props.linkto
                          ? `/${props.linkto}/${item._id}`
                          : `/dev/${item._id}`
                      }
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      {item.username}
                    </NavLink>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Fade>
      </Modal>
    </div>
  );
};

export default ListModal;
