import React, { useState, useEffect } from "react";
import Header from "./Header";
import CompanyLoginForm from "./CompanyLoginForm";
import CompanySignUpForm from "./CompanySignUpForm";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formContainerStyles: {
    marginTop: "3rem",
    padding: "2rem 0",
    overflowY: 'hidden',
    [theme.breakpoints.down("xs")]: {
      margin: 0,
      padding: 0,
      width: "100vw",
      height: "100vh",
    },
  },
}));

const CompanyAuthenticationForm = () => {
  const [loginState, setLoginState] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  useEffect(() => {
    const paths = history.location.pathname.split("/");
    if (paths.includes("signup")) setLoginState(false);
    if (paths.includes("login")) setLoginState(true);
  }, [history.location.pathname]);
  return (
    <div>
      <Header />
      <Grid
        container
        justify="center"
        align="center"
        className={classes.formContainerStyles}
      >
        {loginState ? (
          <CompanyLoginForm setLoginState={setLoginState} />
        ) : (
          <CompanySignUpForm setLoginState={setLoginState} />
        )}
      </Grid>
    </div>
  );
};

export default CompanyAuthenticationForm;
