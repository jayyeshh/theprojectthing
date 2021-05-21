import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
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

const AppRouter = () => {
  return (
    <Router>
      <GlobalModal />
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
        <Route path="/dev/:username" component={DevPage} />
        <Route path="/company/:username" component={CompanyPage} exact />
        <PrivateRoute path="/dashboard" component={Dashboard} exact />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
