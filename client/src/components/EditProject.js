import React, { useState, useEffect } from "react";
import { getProjectById } from "../utility/utilityFunctions/ApiCalls";

const EditProject = ({ location: { state }, ...props }) => {
  console.log(props);
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(async () => {
    if (!state || !state.project) {
      getProjectById(props.computedMatch.params.pid)
        .then((resp) => {
          setProject(resp.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log("error");
          setLoading(false);
        });
    } else {
      setProject(state.project);
      setLoading(false);
    }
  }, []);
  return (
    <div>
      <h2>{project.title}</h2>
    </div>
  );
};

export default EditProject;
