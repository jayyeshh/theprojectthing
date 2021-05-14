import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import FrontPage from "../components/shared/FrontPage";
import Authenticate from "../components/shared/Authenticate";
import NotFound from "../components/shared/NotFound";
import Dashboard from "../components/dashboard/Dashboard";
import CompanyAuthenticationForm from "../components/company/CompanyAuthenticationForm";
import DeveloperAuthenticationForm from "../components/developer/DeveloperAuthenticationForm";
import PrivateRoute from "./PrivateRoute";
import DeveloperOnlyRoute from "./DeveloperOnlyRoute";
import Header from "../components/header/Header";
import AddProject from "../components/project/AddProject";
import ProjectPage from "../components/project/ProjectPage";
import Explore from "../components/explore/Explore";
import EditProfile from "../components/shared/EditProfile";
import SearchResultsPage from "../components/search/SearchResultsPage";
import DevPage from "../components/developer/DevPage";
import GlobalModal from "../components/modals/GlobalModal";
import CompanyPage from "../components/company/CompanyPage";
import PostPage from "../components/post/PostPage";
import { setupAuthentication } from "../actions/authActions";
import Spinner from "../components/spinners/Spinner";
import Test from "../components/test";

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
        <Route path="/test" component={Test} exact />
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
        <Route path="/search" component={SearchResultsPage} exact />

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
