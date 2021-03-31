import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
import FrontPage from "../components/FrontPage";
import Authenticate from "../components/Authenticate";
import NotFound from "../components/NotFound";
import CompanyAuthenticationForm from "../components/CompanyAuthenticationForm";

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={FrontPage} exact />
        <Route path="/auth" component={Authenticate} exact/>
        <Route path="/auth/company/signup" component={CompanyAuthenticationForm} exact/>
        <Route path="/auth/company/login" component={CompanyAuthenticationForm} exact/>
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
