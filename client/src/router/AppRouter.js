import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
import FrontPage from "../components/FrontPage";
import Authenticate from "../components/Authenticate";
import NotFound from "../components/NotFound";
import Dashboard from "../components/Dashboard";
import CompanyAuthenticationForm from "../components/CompanyAuthenticationForm";
import DeveloperAuthenticationForm from "../components/DeveloperAuthenticationForm";
import PrivateRoute from "./PrivateRoute";
import Header from "../components/Header";
import AddProject from '../components/AddProject'

const AppRouter = () => {
 return (
    <Router>
     <Header
      />
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
        <PrivateRoute path="/dashboard" component={Dashboard} exact />
        <PrivateRoute path="/projects/add" component={AddProject} exact />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
