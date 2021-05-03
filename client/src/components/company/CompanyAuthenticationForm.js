import React, { useState, useEffect } from "react";
import LoginForm from "../shared/LoginForm";
import CompanySignUpForm from "./CompanySignUpForm";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formContainerStyles: {
    marginTop: "3rem",
    padding: "2rem 0",
    overflowY: "hidden",
    [theme.breakpoints.down("xs")]: {
      margin: 0,
      padding: 0,
      width: "100vw",
      height: "100vh",
    },
  },
}));

const CompanyAuthenticationForm = (props) => {
  const [loginState, setLoginState] = useState(false);
  const [note, setNote] = useState("");
  const classes = useStyles();
  useEffect(() => {
    const { loginState = true } = props.location;
    setLoginState(loginState);
  }, [props.location]);

  const registered = () => {
    setLoginState(true);
    setNote("Registered Succesfully, login to continue");
  };

  return (
    <div>
      <Grid
        container
        justify="center"
        align="center"
        className={classes.formContainerStyles}
      >
        {loginState ? (
          <LoginForm
            note={note}
            setNote={setNote}
            setLoginState={setLoginState}
          />
        ) : (
          <CompanySignUpForm
            registered={registered}
            setLoginState={setLoginState}
          />
        )}
      </Grid>
    </div>
  );
};

export default CompanyAuthenticationForm;
