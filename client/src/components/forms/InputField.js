import React from "react";
import { Grid, Typography, Input } from "@material-ui/core";

const InputField = ({ required=false, labelText, id, type, value, error, onChangeHandler }) => {
  return (
    <Grid
      container
      direction="column"
      alignContent="center"
      style={{ width: "100%", marginTop: "1rem" }}
    >
      <label htmlFor={id}>
        <Typography
          style={{ display: "flex", textAlign: "center", alignSelf: "center" }}
        >
          {labelText}
        </Typography>
      </label>
      <Input
        value={value}
        required={required}
        type={type}
        onChange={onChangeHandler}
        name={id}
        error={error}
        id={id}
        style={{ width: "100%" }}
      />
    </Grid>
  );
};

export default InputField;
