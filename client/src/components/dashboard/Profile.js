import React from "react";
import { connect } from "react-redux";
import SideProfile from "../SideProfile";

const Profile = ({ as, user, projects, posts, isAuthed }) => {
  return (
    <SideProfile
      as={as}
      user={user}
      projects={projects}
      posts={posts}
      isAuthed={isAuthed}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthed: state.authReducer.authenticated,
    as: state.authReducer.as,
    user: state.authReducer.user,
    projects: state.projectReducer.projects,
    posts: state.postReducer.posts,
  };
};

export default connect(mapStateToProps)(Profile);
