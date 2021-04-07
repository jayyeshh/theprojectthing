import axios from "../utility/axios/apiInstance";
import React, { useState, useEffect } from "react";

const MemberListPage = (props) => {
  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const configs = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    const path = props.location.pathname;
    axios
      .get(path, configs)
      .then((resp) => {
        console.log("+> ", resp);
      })
      .catch((error) => {
        console.log("Something went wrong!", error);
      });
  }, []);
  return <div>MemberListPage</div>;
};

export default MemberListPage;
