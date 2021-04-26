import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import FrontPage from "../components/FrontPage";
import Authenticate from "../components/Authenticate";
import NotFound from "../components/NotFound";
import Dashboard from "../components/Dashboard";
import CompanyAuthenticationForm from "../components/CompanyAuthenticationForm";
import DeveloperAuthenticationForm from "../components/DeveloperAuthenticationForm";
import PrivateRoute from "./PrivateRoute";
import DeveloperOnlyRoute from "./DeveloperOnlyRoute";
import { Grid } from "@material-ui/core";
import Header from "../components/Header";
import AddProject from "../components/AddProject";
import ProjectPage from "../components/ProjectPage";
import Explore from "../components/Explore";
import EditProfile from "../components/EditProfile";
import DevPage from "../components/DevPage";
import GlobalModal from "../components/GlobalModal";
import CompanyPage from "../components/CompanyPage";
import PostPage from "../components/PostPage";
import { setupAuthentication } from "../actions/authActions";
import Spinner from "../components/Spinner";

const AppRouter = (props) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function setup() {
      await setupAuthentication();
      setLoading(false);
    }
    setup();
  }, []);

  if (loading)
    return (
      <Grid
        container
        align="center"
        alignItems="center"
        alignContent="center"
        justify="center"
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <Spinner />
      </Grid>
    );

  return (
    <Router>
      {props.showModal && <GlobalModal modalText={props.modalText} />}
      <Header />
      <Switch>
        <Route path="/" component={FrontPage} exact />
        <Route path="/auth" component={Authenticate} exact />
        <Route
          path="/auth/company"
          component={CompanyAuthenticationForm}
          exact
        />
        <Route
          path="/auth/developer"
          component={DeveloperAuthenticationForm}
          exact
        />
        <PrivateRoute path="/profile/edit" component={EditProfile} />
        <DeveloperOnlyRoute path="/projects/add" component={AddProject} exact />
        <Route path="/explore" component={Explore} exact />
        <DeveloperOnlyRoute
          path="/projects/edit/:pid"
          component={AddProject}
          exact
        />
        <Route path="/projects/:id" component={ProjectPage} />
        <Route path="/post/:id" component={PostPage} exact />
        <Route path="/dev/:id" component={DevPage} />
        <Route path="/company/:id" component={CompanyPage} exact />
        <PrivateRoute path="/dashboard" component={Dashboard} exact />

        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

const mapStateToProps = (state) => {
  return {
    showModal: state.modalReducer.showModal,
    modalText: state.modalReducer.text,
  };
};

export default connect(mapStateToProps, null)(AppRouter);
