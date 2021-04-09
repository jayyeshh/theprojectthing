import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import React from "react";
import FrontPage from "../components/FrontPage";
import Authenticate from "../components/Authenticate";
import NotFound from "../components/NotFound";
import Dashboard from "../components/Dashboard";
import CompanyAuthenticationForm from "../components/CompanyAuthenticationForm";
import DeveloperAuthenticationForm from "../components/DeveloperAuthenticationForm";
import PrivateRoute from "./PrivateRoute";
import DeveloperOnlyRoute from "./DeveloperOnlyRoute";
import CompanyOnlyRoute from "./CompanyOnlyRoute";
import Header from "../components/Header";
import AddProject from "../components/AddProject";
import ProjectPage from "../components/ProjectPage";
import MemberListPage from "../components/MemberListPage";
import Explore from "../components/Explore";
import EditProject from "../components/EditProject";
import DevPage from "../components/DevPage";
import GlobalModal from "../components/GlobalModal";
import CompanyPage from "../components/CompanyPage";
import PostPage from "../components/PostPage";

const AppRouter = (props) => {
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
        <DeveloperOnlyRoute path="/projects/add" component={AddProject} exact />
        <DeveloperOnlyRoute
          path="/followers"
          component={MemberListPage}
          exact
        />
        <DeveloperOnlyRoute
          path="/followings"
          component={MemberListPage}
          exact
        />
        <Route path="/explore" component={Explore} exact />
        <Route path="/projects/:id" component={ProjectPage} exact />
        <Route path="/post/:id" component={PostPage} exact />
        <Route path="/dev/:id" component={DevPage} exact />
        <Route path="/company/:id" component={CompanyPage} exact />
        <PrivateRoute path="/dashboard" component={Dashboard} exact />
        <DeveloperOnlyRoute
          path="/projects/edit/:pid"
          component={AddProject}
          exact
        />
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
