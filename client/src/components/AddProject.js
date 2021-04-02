import {
  Paper,
  Grid,
  TextField,
  CircularProgress,
  TextareaAutosize,
  Button,
  Typography,
} from "@material-ui/core";
import axios from "../utility/axios/apiInstance";
import React, { useState } from "react";
import { green } from "@material-ui/core/colors";
import GitHubIcon from "@material-ui/icons/GitHub";
import { DropzoneArea } from "material-ui-dropzone";
import { makeStyles } from "@material-ui/core/styles";

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
};

const errorInitials = {
  ...initials,
  error: "",
};

const AddProject = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [fieldValues, setFieldValues] = useState(initials);

  const [errors, setErrors] = useState(errorInitials);

  const onChangeHandler = (e) => {
    setFieldValues({ ...fieldValues, [e.target.name]: e.target.value });
  };

  const handleDropzoneChange = (file) => {
    setFieldValues({ ...fieldValues, photo: file[0] });
  };

  const addThisProject = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("photo", fieldValues.photo);
    data.append("title", fieldValues.title);
    const configs = {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDY1OGRlYWMxNzM0MTMwNTI0N2FhYTIiLCJhcyI6IkRldmVsb3BlciIsImlhdCI6MTYxNzM2MzY3NX0.OI_7PZfcmsXYjzyBXOeKkNwEczar1ZKlfVS5RrSaIB8`,
      },
    };
    axios
      .post("/project/", data, configs)
      .then((resp) => {
        console.log("resp: ", resp);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  return (
    <Paper className={classes.container}>
      <Typography
        className={classes.title}
        align="center"
        component="h1"
        variant="h4"
      >
        Add Project
      </Typography>
      {errors.error && (
        <Typography component="h1" variant="h5" className={classes.errorStyles}>
          {errors.error}
        </Typography>
      )}
      <form onSubmit={addThisProject} className={classes.formStyles}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              autoComplete="title"
              name="title"
              error={!!errors.title}
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
              name="url"
              type="site"
              error={!!errors.site}
              variant="outlined"
              onChange={onChangeHandler}
              fullWidth
              id="site"
              label="Site"
            />
          </Grid>
          <TextareaAutosize
            style={{ marginLeft: ".6rem" }}
            multiline
            rows={5}
            cols={137}
            style={{
              padding: ".6rem",
              marginLeft: ".6rem",
            }}
            label="Project Description"
            placeholder="Project Description"
            name="about"
            id="about"
          />
        </Grid>
        <Grid xs={12} className={classes.dropzoneStyles}>
          <DropzoneArea
            onChange={handleDropzoneChange}
            acceptedFiles={["image/*"]}
            dropzoneText={"Add a snapshot of project"}
            filesLimit={1}
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
            add project
          </Button>

          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </form>
    </Paper>
  );
};

export default AddProject;
