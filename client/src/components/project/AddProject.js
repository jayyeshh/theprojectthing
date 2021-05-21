import {
  Paper,
  Grid,
  TextField,
  CircularProgress,
  Button,
  Typography,
} from "@material-ui/core";
import axios from "../../utility/axios/apiInstance";
import React, { useEffect, useState } from "react";
import { green } from "@material-ui/core/colors";
import { DropzoneArea } from "material-ui-dropzone";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { setupAuthentication } from "../../actions/authActions";
import { getProjectById } from "../../utility/utilityFunctions/ApiCalls";
import { setModalStateAction } from "../../actions/modalActions";
import { useConfirm } from "material-ui-confirm";
import { connect } from "react-redux";
import Spinner from "../spinners/Spinner";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    margin: "0 20rem",
    padding: "2rem",
    overflow: "hidden",
    [theme.breakpoints.down("md")]: {
      margin: 0,
      padding: 0,
      marginTop: "1rem",
    },
  },
  title: {
    color: "#666",
  },
  submitBtnStyles: {
    margin: "1rem 0",
    padding: ".6rem",
  },
  formStyles: {
    margin: "1rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evently",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      margin: 0,
      padding: "1rem",
      alignItems: "flex-start",
    },
  },
  linkStyle: {
    color: "blue",
    margin: ".6rem",
    "&:hover": {
      cursor: "pointer",
    },
  },
  formContainerStyles: {
    padding: ".8rem",
    maxWidth: "25rem",
    minHeight: "28rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 1,
    [theme.breakpoints.down("md")]: {
      margin: "0",
      padding: "0",
      width: "100vw",
    },
  },
  paperStyles: {
    [theme.breakpoints.down("xs")]: {
      width: "100vw",
      height: "100vh",
    },
  },
  errorStyles: {
    color: "red",
    fontSize: "1.1rem",
    marginTop: ".8rem",
    marginBottom: "-.8rem",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "35%",
    left: "45%",
  },
  btnContainerStyles: {
    width: "100%",
    position: "relative",
  },
  deleteBtn: {
    backgroundColor: "#d14a30",
    color: "#fff",
    margin: 0,
    "&:hover": {
      backgroundColor: "#ba2407",
    },
  },
  dropzoneStyles: {
    marginTop: "2rem",
    width: "100%",
  },
}));

const initials = {
  title: "",
  about: "",
  github: "",
  site: "",
  tags: "",
  photos: [],
};

const errorInitials = {
  ...initials,
  error: "",
};

const AddProject = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const confirmation = useConfirm();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [fieldValues, setFieldValues] = useState(initials);
  const [task, setTask] = useState("");
  const [errors, setErrors] = useState(errorInitials);

  useEffect(() => {
    if (props.location.pathname.startsWith("/projects/add")) {
      setTask("toadd");
      setFieldValues(initials);
      setInitialLoad(false);
    }
    if (props.location.pathname.startsWith("/projects/edit")) {
      setTask("toedit");
      const { pid } = props.computedMatch.params;
      getProjectById(pid)
        .then((resp) => {
          const { title, about, photos, tags } = resp.data;
          const { github, site } = resp.data.links;
          setFieldValues({
            ...initials,
            title,
            about,
            github,
            photos,
            site,
            tags: tags.join(", "),
          });
          setLoading(false);
          setInitialLoad(false);
        })
        .catch((error) => {
          console.log(error.response);
          setInitialLoad(false);
          setLoading(false);
        });
    }
  }, [props.location.pathname]);

  const onChangeHandler = (e) => {
    setFieldValues({ ...fieldValues, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleDropzoneChange = (file) => {
    setFieldValues({ ...fieldValues, photos: file });
  };

  const editProject = (e) => {
    e.preventDefault();
    setLoading(true);
    const tags = fieldValues.tags.split(",").map((tag) => tag.trim());

    const data = new FormData();
    fieldValues.photos.forEach((photo) => {
      data.append("photo", photo);
    });
    data.append("title", fieldValues.title);
    data.append("about", fieldValues.about);
    data.append("github", fieldValues.github);
    data.append("site", fieldValues.site);
    data.append("tags", JSON.stringify(tags));
    const configs = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    axios
      .patch(`/project/${props.computedMatch.params.pid}`, data, configs)
      .then((resp) => {
        setLoading(false);
        history.push(`/projects/${props.computedMatch.params.pid}`);
        setupAuthentication();
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.data.error) {
          props.setModalState(true, err.response.data.error, "error");
        } else {
          props.setModalState(true, `Something went wrong!`, "error");
        }
      });
  };

  const deleteProject = () => {
    confirmation({
      description: "This Project will be deleted permanently!",
      confirmationText: "Delete",
      confirmationButtonProps: { color: "secondary" },
    })
      .then(() => {
        const configs = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };
        axios
          .delete(`/project/${props.computedMatch.params.pid}`, configs)
          .then((_resp) => {
            props.setModalState(true, `Project Deleted Permanently!`, "info");
            history.replace("/");
          })
          .catch((error) => {
            props.setModalState(
              true,
              `Something went wrong! Try again later.`,
              "error"
            );
          });
      })
      .catch(() => {});
  };

  const addThisProject = (e) => {
    e.preventDefault();
    setLoading(true);
    const tags = fieldValues.tags.split(",").map((tag) => tag.trim());
    const data = new FormData();
    fieldValues.photos.forEach((photo) => {
      data.append("photo", photo);
    });
    data.append("title", fieldValues.title);
    data.append("about", fieldValues.about);
    data.append("github", fieldValues.github);
    data.append("site", fieldValues.site);
    data.append("tags", JSON.stringify(tags));
    const configs = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    axios
      .post("/project/", data, configs)
      .then((resp) => {
        setLoading(false);
        const { project } = resp.data;
        history.push(`/projects/${project._id}`);
        setupAuthentication();
      })
      .catch((err) => {
        setLoading(false);
        let errormsg = { ...errorInitials };
        if (err.response && err.response.data.errors) {
          errormsg = {
            ...errormsg,
            ...err.response.data.errors,
          };

          props.setModalState(true, errormsg.error, "error");
        } else {
          errormsg = {
            ...errormsg,
            error:
              err.response && err.response.data.error
                ? err.response.data.error
                : "",
          };
          props.setModalState(true, errormsg.error, "error");
        }
        setErrors({ ...errormsg });
      });
  };

  if (initialLoad) {
    return (
      <Grid
        container
        align="center"
        justify="center"
        alignContent="center"
        style={{ minWidth: "100vw", minHeight: "70vh" }}
      >
        <Spinner />
      </Grid>
    );
  }

  return (
    <Paper className={classes.container}>
      <Typography
        className={classes.title}
        align="center"
        component="h1"
        variant="h4"
      >
        {task === "toadd" ? "Add Project" : "Edit Project"}
      </Typography>
      {errors.error && (
        <Typography component="h1" variant="h5" className={classes.errorStyles}>
          {errors.error}
        </Typography>
      )}
      <form
        onSubmit={task === "toadd" ? addThisProject : editProject}
        className={classes.formStyles}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              autoComplete="title"
              name="title"
              error={!!errors.title}
              value={fieldValues.title}
              variant="outlined"
              onChange={onChangeHandler}
              required
              fullWidth
              id="title"
              label="Project Title"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete="github"
              name="github"
              type="url"
              value={fieldValues.github}
              style={{
                marginBottom: ".8rem",
              }}
              error={!!errors.github}
              variant="outlined"
              onChange={onChangeHandler}
              fullWidth
              id="github"
              label="Github Repo Url"
            />
            <TextField
              autoComplete="site"
              name="site"
              type="url"
              value={fieldValues.site}
              error={!!errors.site}
              variant="outlined"
              onChange={onChangeHandler}
              fullWidth
              id="site"
              label="Site"
            />
          </Grid>
          <TextField
            multiline
            variant="outlined"
            rows={5}
            cols={137}
            fullWidth
            value={fieldValues.about}
            style={{
              padding: ".6rem",
            }}
            label="Description"
            placeholder="Project Description"
            onChange={onChangeHandler}
            name="about"
            id="about"
          />
          <TextField
            variant="outlined"
            rows={5}
            cols={137}
            fullWidth
            value={fieldValues.tags}
            style={{
              padding: ".6rem",
            }}
            placeholder="Ex: javascript, react"
            label="Tags(comma separated)"
            onChange={onChangeHandler}
            name="tags"
            id="tags"
          />
        </Grid>
        <Grid item xs={12} className={classes.dropzoneStyles}>
          <DropzoneArea
            onChange={handleDropzoneChange}
            initialFiles={fieldValues.photos}
            acceptedFiles={["image/*"]}
            dropzoneText={"Add a snapshot of project"}
            filesLimit={6}
            clearOnUnmount
          />
        </Grid>
        <div className={classes.btnContainerStyles}>
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            variant="contained"
            color="secondary"
            className={classes.submitBtnStyles}
          >
            {task === "toadd" ? "add project" : "update"}
          </Button>
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
        {task === "toedit" && (
          <Button
            fullWidth
            disabled={loading}
            variant="contained"
            color="#ab3018"
            className={classes.deleteBtn}
            onClick={() => deleteProject()}
          >
            Delete Project
          </Button>
        )}
      </form>
    </Paper>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setModalState: (modalState, text, severity) =>
      dispatch(setModalStateAction({ showModal: modalState, text, severity })),
  };
};

export default connect(null, mapDispatchToProps)(AddProject);
