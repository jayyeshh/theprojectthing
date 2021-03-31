import {
  TextField,
  Container,
  Typography,
  Paper,
  Avatar,
  Grid,
  CssBaseline,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import axios from "../utility/axios/apiInstance";

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
  },
  linkStyle: {
    color: "blue",
    "&:hover": {
      cursor: "pointer",
    },
  },
  formContainerStyles: {
    padding: ".8rem",
    maxWidth: "25rem",
    height: "28rem",
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
    marginTop: '.8rem',
    marginBottom: '-.8rem'
  },
}));

const CompanyLoginForm = (props) => {
  const classes = useStyles();
  const [fieldValues, setFieldValues] = useState({
    identity: "",
    password: "",
  });
  const [error, setError] = useState("");

  const onChangeHandler = (e) => {
    setFieldValues({ ...fieldValues, [e.target.name]: e.target.value });
  };

  const login = (e) => {
    e.preventDefault();
    const { identifier, password } = fieldValues;
    axios
      .post("/company/login", {
        identifier,
        password,
      })
      .then((resp) => {
        console.log("=> ", resp);
        setError("");
      })
      .catch((error) => {
        setError(error.response.data.error);
      });
  };

  return (
    <Paper className={classes.paperStyles} elevation={15}>
      {error && (
        <Typography component="h1" variant="h5" className={classes.errorStyles}>
          {error}
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
            Login
          </Typography>
        </div>
        <form onSubmit={login} className={classes.formStyles}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="username/email"
                variant="outlined"
                required
                fullWidth
                id="identifier"
                name="identifier"
                onChange={onChangeHandler}
                label="Username or Email"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                variant="outlined"
                type="password"
                required
                name="password"
                onChange={onChangeHandler}
                fullWidth
                id="password"
                label="Password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submitBtnStyles}
          >
            Login
          </Button>
        </form>
        <Grid container justify="center">
          <Grid item>
            <Typography>
              Need an account?{" "}
              <span
                className={classes.linkStyle}
                onClick={() => props.setLoginState(false)}
              >
                SignUp
              </span>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
};

export default CompanyLoginForm;
