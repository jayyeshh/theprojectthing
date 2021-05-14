import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import { deleteProjects } from "../../utility/utilityFunctions/ApiCalls";
import { connect } from "react-redux";
import { setModalStateAction } from "../../actions/modalActions";
import { useConfirm } from "material-ui-confirm";
import { NavLink } from "react-router-dom";
import { InputBase } from "@material-ui/core";

function createData(
  id,
  title,
  upvotes,
  downvotes,
  rewards,
  comments,
  uploadedOn,
  lastUpdated
) {
  return {
    id,
    title,
    upvotes,
    downvotes,
    rewards,
    comments,
    uploadedOn,
    lastUpdated,
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "title",
    numeric: false,
    disablePadding: true,
    label: "Title",
  },
  { id: "upvotes", numeric: true, disablePadding: false, label: "Upvotes" },
  { id: "downvotes", numeric: true, disablePadding: false, label: "Downvotes" },
  { id: "rewards", numeric: true, disablePadding: false, label: "Rewards" },
  { id: "comments", numeric: true, disablePadding: false, label: "Comments" },
  {
    id: "uploadedOn",
    numeric: true,
    disablePadding: false,
    label: "Uploaded On",
  },
  {
    id: "lastUpdated",
    numeric: true,
    disablePadding: false,
    label: "Last Updated",
  },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              style={{
                fontWeight: 600,
              }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
  searchBar: {
    padding: "0 4px",
    borderRadius: "4px",
    background: "#F3F3F3",
    transition: "all ease-in-out .2s",
    [theme.breakpoints.up("md")]: {
      minWidth: "14rem",
    },
  },
  searchbarFocused: {
    border: "1px solid #999",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;
  const confirmation = useConfirm();

  const deleteSelected = () => {
    const descriptionString = `${props.selectedIds.length} ${
      props.selectedIds.length > 1 ? "Projects" : "Project"
    } will be deleted?`;

    confirmation({
      description: descriptionString,
      confirmationText: "Delete",
      confirmationButtonProps: { color: "secondary" },
    })
      .then(() => {
        deleteProjects(props.selectedIds)
          .then((resp) => {
            props.setModalState(
              true,
              `${props.selectedIds.length} ${
                props.selectedIds.length > 1 ? "Projects" : "Project"
              } Deleted`
            );
            setTimeout(() => {
              props.setModalState(false, "");
            }, 3000);
            const updatedProjects = props.projects.filter(
              (project) => !props.selectedIds.includes(project._id)
            );
            props.updateProjects(updatedProjects);
            props.deselectAll();
          })
          .catch((error) => {
            console.log(error);
            props.setModalState(true, `Something went wrong!`);
            setTimeout(() => {
              props.setModalState(false, "");
            }, 3000);
          });
      })
      .catch(() => {});
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <InputBase
        placeholder="Search"
        className={classes.searchBar}
        classes={{
          focused: classes.searchbarFocused,
        }}
        onChange={props.searchChangeHandler}
      />
      {numSelected > 0 && (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton
            aria-label="delete"
            onClick={deleteSelected}
            disabled={!props.haveAccess}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "90%",
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  titleLink: {
    color: "black",
    textDecoration: "none",
    "&:hover": {
      color: "blue",
    },
  },
}));

const TableView = ({ projects, ...props }) => {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [projectsToRender, setProjectsToRender] = useState([]);

  useEffect(() => {
    // setProjectsToRender(projects);
    // if (searchText.trim().length) {
    //   const projectList = projects.filter((project) =>
    //     project.title.startsWith(searchText)
    //   );
    //   setProjectsToRender(projectList);
    // }else{
    //   setProjectsToRender(projects)
    // }

    const dataRows = [];
    projects.forEach((project) => {
      let {
        _id,
        title,
        upvotes = [],
        downvotes = [],
        rewards = [],
        comments = [],
        createdAt,
        updatedAt,
      } = project;
      if (
        !searchText.trim().length ||
        title.toLowerCase().startsWith(searchText.trim().toLowerCase())
      ) {
        dataRows.push(
          createData(
            _id,
            title,
            upvotes.length,
            downvotes.length,
            rewards.length,
            comments.length,
            new moment(createdAt).format("YYYY, MMM DD"),
            new moment(updatedAt).format("YYYY, MMM DD")
          )
        );
      }
    });
    setRows(dataRows);
  }, [projects, searchText]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      let newSelecteds = [],
        allIds = [];
      rows.forEach((n) => {
        newSelecteds.push(n.title);
        allIds.push(n.id);
      });
      setSelected(newSelecteds);
      setSelectedIds(allIds);
      return;
    }
    setSelected([]);
    setSelectedIds([]);
  };

  const deselectAll = () => {
    setSelected([]);
    setSelectedIds([]);
  };

  const handleClick = (event, name, id) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelectedIds((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter((theid) => theid !== id);
      } else {
        return Array.from(new Set([...prevState].concat(id)));
      }
    });

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const searchChangeHandler = (e) => {
    setSearchText(e.target.value);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          selectedIds={selectedIds}
          projects={projects}
          updateProjects={props.updateProjects}
          searchChangeHandler={searchChangeHandler}
          setModalState={props.setModalState}
          deselectAll={deselectAll}
          haveAccess={props.haveAccess}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.title);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.title, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.title}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <NavLink
                          to={`/projects/${row.id}`}
                          className={classes.titleLink}
                        >
                          {row.title}
                        </NavLink>
                      </TableCell>
                      <TableCell align="right">{row.upvotes}</TableCell>
                      <TableCell align="right">{row.downvotes}</TableCell>
                      <TableCell align="right">{row.rewards}</TableCell>
                      <TableCell align="right">{row.comments}</TableCell>
                      <TableCell align="right">{row.uploadedOn}</TableCell>
                      <TableCell align="right">{row.lastUpdated}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setModalState: (modalState, text) =>
      dispatch(setModalStateAction({ showModal: modalState, text })),
  };
};

export default connect(null, mapDispatchToProps)(TableView);
