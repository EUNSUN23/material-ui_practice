import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fade, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SearchMenu from "./components/SearchMenu";
import SearchInput from "./components/SearchInput";
import { Grid } from "@material-ui/core";
import { initKeywords, addKeywords } from "../../store/actions/keywords";
import { getEmpData } from "../../store/actions/searchEmp";
import { isValid } from "../../shared/utility";
import theme from "../../theme";
import DefaultAppBar from "../UI/DefaultAppBar";

const useStyles = makeStyles({
  searchContainer: {
    position: "relative",
    width: "70vw",
    height: "14vh",
    [theme.breakpoints.up("md")]: {
      width: "50vw",
    },
    [theme.breakpoints.only("sm")]: {
      width: "70vw",
    },
  },

  submit: {
    color: "white",
    fontSize: "1.4vw",
    minWidth: "10vw",
    [theme.breakpoints.up("sm")]: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: "1.2vw",
      minWidth: "5vw",
    },
  },
  search_input: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    marginLeft: theme.spacing(3),
    width: "85%",
  },
  search_select: {
    borderRadius: theme.shape.borderRadius,
    marginLeft: theme.spacing(3),
  },
  searchInput: {
    "&:hover": {
      width: "100%",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "50%",
    position: "absolute",
    pointerEvents: "none",
    top: "15%",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(5)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "20vw",
    },
  },
  searchOption: {
    position: "relative",
  },
});

const SearchBar = () => {
  const classes = useStyles({ theme });

  const dispatch = useDispatch();
  const keywords = useSelector((state) => state.keywords.keywords);
  const page = useSelector((state) => state.searchEmp.page);
  const option = useSelector((state) => state.searchBar.option);
  const inputVal = useSelector((state) => state.searchBar.inputVal);
  const optionVal = useSelector((state) => state.searchBar.optionVal);

  useEffect(() => {
    if (keywords.length === 0) dispatch(initKeywords());
  }, []);

  const submitData = (e) => {
    e.preventDefault();
    if (option === "이름검색") {
      isValid(inputVal);
      dispatch(getEmpData(inputVal, page, "noPage"));
      dispatch(addKeywords("name", inputVal));
    } else {
      isValid(optionVal.value);
      dispatch(getEmpData(optionVal, page, "noPage"));
      dispatch(addKeywords(optionVal.category, optionVal.value));
    }
  };

  return (
    <DefaultAppBar type="employeeSearch">
      <form
        onSubmit={(e) => {
          submitData(e);
        }}
      >
        <Grid
          container
          direction="row"
          alignItems="center"
          justify="center"
          className={classes.searchContainer}
        >
          <Grid item xs={2} className={classes.searchOption}>
            <SearchMenu />
          </Grid>
          <Grid item xs={7} className={classes.searchInputContainer}>
            <SearchInput classes={classes} />
          </Grid>
          <Grid item xs={1}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.submit}
              onClick={(e) => {
                submitData(e);
              }}
            >
              검색
            </Button>
          </Grid>
        </Grid>
      </form>
    </DefaultAppBar>
  );
};

export default SearchBar;
