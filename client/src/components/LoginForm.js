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
import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "../utility/axios/apiInstance";
import { loginAction } from "../actions/authActions";
import { useHistory } from "react-router-dom";

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
    marginTop: ".8rem",
    marginBottom: "-.8rem",
  },
  noteStyles: {
    color: "green",
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

const LoginForm = (props) => {
  const history = useHistory();
  if (props.auth.authenticated) history.push("/");
  const classes = useStyles();
  const [fieldValues, setFieldValues] = useState({
    identity: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [loginFor, setLoginFor] = useState("developer");
  const [error, setError] = useState("");
  useEffect(() => {
    if (history.location.pathname.split("/").includes("company")) {
      setLoginFor("company");
    }
    if (history.location.pathname.split("/").includes("developer")) {
      setLoginFor("developer");
    }
  }, [history.location.pathname]);

  const onChangeHandler = (e) => {
    setFieldValues({ ...fieldValues, [e.target.name]: e.target.value });
  };

  const login = (e) => {
    e.preventDefault();
    const { identifier, password } = fieldValues;
    setLoading(true);
    axios
      .post(`/${loginFor}/login`, {
        identifier,
        password,
      })
      .then((resp) => {
        console.log(resp);
        setLoading(false);
        setError("");
        props.setNote("");
        props.login(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (!error.response) {
          return setError("Something went wrong.Try Again later!");
        }
        props.setNote("");
        setError(error.response.data.error);
      });
  };

  return (
    <Paper className={classes.paperStyles} elevation={15}>
      {!!props.note && (
        <Typography
          component="h1"
          variant="h5"
          className={`${classes.errorStyles} ${classes.noteStyles}`}
        >
          {props.note}
        </Typography>
      )}
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
                onChange={onChangeHandler}
                fullWidth
                id="password"
                label="Password"
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
              Login
            </Button>

            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
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

const mapStateToProps = (state) => {
  return {
    auth: state.authReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (data) => dispatch(loginAction(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
