import React, { useState, useEffect } from "react";
import DeveloperModeIcon from "@material-ui/icons/DeveloperMode";
import axios from "../utility/axios/apiInstance";

const ProjectPage = (props) => {
  const [project, setProject] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const config = {};
    //   headers: {
    //     Authorization: localStorage.getItem("authToken"),
    //   },
    axios
      .get(`/project/${props.match.params.id}`, config)
      .then((resp) => {
        setProject(resp.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  if (error) {
    return <h1>Something went wrong!</h1>;
  }

  return (
    <div>
      {!Object.keys(project).length ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          <DeveloperModeIcon />
          <div>{project.title}</div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
