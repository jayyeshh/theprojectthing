import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    margin: '1rem'
  },
  navlinkStyels: {
    textDecoration: "none",
    opacity: '.9',
    transition: 'all .2s ease-in-out',
    "&:hover": {
        opacity: '1',
        backgroundColor: '#cfcfcf',
    },
  },
});

const AuthCard = (props) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.para}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <NavLink
          className={classes.navlinkStyels}
          to={"/auth/" + props.for + "/signup"}
        >
          <Button size="small" color="primary">
            SignUp
          </Button>
        </NavLink>
        <NavLink
          className={classes.navlinkStyels}
          to={"/auth/" + props.for + "/login"}
        >
          <Button size="small" color="primary">
            Login
          </Button>
        </NavLink>
      </CardActions>
    </Card>
  );
};

export default AuthCard;
