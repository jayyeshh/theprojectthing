import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import AppRouter from "./router/AppRouter";
import { Provider } from "react-redux";
import store from "./store";
import { ConfirmProvider } from "material-ui-confirm";

const render = async () => {
  ReactDOM.render(
    <Provider store={store}>
      <ConfirmProvider>
        <AppRouter />
      </ConfirmProvider>
    </Provider>,
    document.getElementById("root")
  );

  reportWebVitals();
};

render();
