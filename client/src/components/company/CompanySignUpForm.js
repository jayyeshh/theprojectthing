import {
  TextField,
  Container,
  Typography,
  Paper,
  Avatar,
  Grid,
  CssBaseline,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "../../utility/axios/apiInstance";
import { green } from "@material-ui/core/colors";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
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
      margin: "1rem 0",
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
}));

const initials = {
  username: "",
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const errorInitials = {
  ...initials,
  error: "",
};

const CompanySignUpForm = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [fieldValues, setFieldValues] = useState(initials);

  const [errors, setErrors] = useState(errorInitials);

  const onChangeHandler = (e) => {
    setFieldValues({ ...fieldValues, [e.target.name]: e.target.value });
  };

  const signup = (e) => {
    e.preventDefault();
    const { username, name, email, password, confirmPassword } = fieldValues;
    if (password !== confirmPassword) {
      return setErrors({
        ...errorInitials,
        password: "password mismatch!",
        confirmPassword: "password mismatch!",
        error: "password mismatch!",
      });
    }
    setLoading(true);
    axios
      .post("/company/register", {
        username,
        email,
        name,
        password,
      })
      .then((resp) => {
        setLoading(false);
        setErrors(errorInitials);

        if (resp.status === 201) {
          props.registered();
        }
      })
      .catch((error) => {
        setLoading(false);
        if (!error.response) {
          return setErrors({
            ...errorInitials,
            error: "Something went wrong. Try again after some time!",
          });
        }
        const data = error.response.data;
        if (data.password) {
          return setErrors({
            ...errorInitials,
            password: data.password,
            confirmPassword: data.password,
            error: data.password,
          });
        }
        setErrors({ ...errorInitials, ...data });
      });
  };
  return (
    <Paper className={classes.paperStyles} elevation={15}>
      {errors.error && (
        <Typography component="h1" variant="h5" className={classes.errorStyles}>
          {errors.error}
        </Typography>
      )}
      <Container
        className={classes.formContainerStyles}
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
        <div>
          <Avatar />
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
        </div>
        <form onSubmit={signup} className={classes.formStyles}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="username"
                name="username"
                error={!!errors.username}
                variant="outlined"
                onChange={onChangeHandler}
                required
                fullWidth
                id="username"
                label="Username"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                error={!!errors.name}
                variant="outlined"
                onChange={onChangeHandler}
                required
                fullWidth
                id="name"
                label="Name"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                autoComplete="email"
                name="email"
                type="email"
                error={!!errors.email}
                variant="outlined"
                required
                onChange={onChangeHandler}
                fullWidth
                id="email"
                label="Email"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="password"
                variant="outlined"
                error={!!errors.password}
                type="password"
                required
                onChange={onChangeHandler}
                fullWidth
                id="password"
                label="Password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                error={!!errors.confirmPassword}
                variant="outlined"
                type="password"
                onChange={onChangeHandler}
                required
                fullWidth
                id="confirm-password"
                label="Confirm Password"
              />
            </Grid>
          </Grid>
          <div className={classes.btnContainerStyles}>
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              variant="contained"
              color="primary"
              className={classes.submitBtnStyles}
            >
              Sign up
            </Button>

            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </form>
        <Grid container justify="center">
          <Grid item>
            <Typography>
              Already have an account?
              <span
                className={classes.linkStyle}
                onClick={() => props.setLoginState(true)}
              >
                Login
              </span>
              instead
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
};

export default CompanySignUpForm;
