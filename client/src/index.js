import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import AppRouter from "./router/AppRouter";
import { Provider } from "react-redux";
import store from "./store";
import { setupAuthentication } from "./actions/authActions";

const render = async () => {
  await setupAuthentication();
  ReactDOM.render(
    <Provider store={store}>
      <AppRouter />
    </Provider>,
    document.getElementById("root")
  );

  reportWebVitals();
};

render();
