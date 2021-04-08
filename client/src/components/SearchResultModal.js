import React from "react";

const SearchResultModal = ({ searchedItems }) => {
  return (
    <Paper elevation={4} className={classes.searchResults}>
      <Grid container>
        {searchedItems.map((item) => {
          if (item.title) {
            return (
              <NavLink
                to={`/project/${item._id}`}
                className={classes.linkStyles}
              >
                <Grid
                  xs={12}
                  item
                  container
                  align="center"
                  alignContent="center"
                  direction="row"
                  justify="flex-start"
                  className={classes.searchResult}
                >
                  <Avatar>
                    <CodeIcon />
                  </Avatar>
                  <Typography className={classes.titleName}>
                    {item.title}
                  </Typography>
                </Grid>
              </NavLink>
            );
          } else if (item.username && !!item.db) {
            return (
              <NavLink
                to={`/company/${item._id}`}
                className={classes.linkStyles}
              >
                <Grid
                  item
                  container
                  align="center"
                  alignContent="center"
                  direction="row"
                  justify="flex-start"
                >
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                  <Typography className={classes.titleName}>
                    {item.title}
                  </Typography>
                </Grid>
              </NavLink>
            );
          } else if (item.username) {
            return (
              <NavLink to={`/dev/${item._id}`} className={classes.linkStyles}>
                <Grid
                  item
                  container
                  align="center"
                  alignContent="center"
                  direction="row"
                  justify="flex-start"
                  className={classes.searchResult}
                >
                  <Avatar>{item.username.charAt(0)}</Avatar>
                  <Typography className={classes.titleName}>
                    {item.username}
                  </Typography>
                </Grid>
              </NavLink>
            );
          }
        })}
      </Grid>
    </Paper>
  );
};

export default SearchResultModal;
