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
import React from "react";

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
}));

const signup = (e) => {
  e.preventDefault();
  console.log("signup company...");
};

const CompanySignUpForm = (props) => {
  const classes = useStyles();
  return (
    <Paper className={classes.paperStyles} elevation={15}>
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
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="email"
                name="email"
                type="email"
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email"
                autoFocus
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="password"
                variant="outlined"
                type="password"
                required
                fullWidth
                id="password"
                label="Password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirm-password"
                variant="outlined"
                type="password"
                required
                fullWidth
                id="confirm-password"
                label="Confirm Password"
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
            Sign Up
          </Button>
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
