import React, { useState, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fade, makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MoreIcon from "@material-ui/icons/MoreVert";
import HomeIcon from "@material-ui/icons/Home";
import Button from "@material-ui/core/Button";
import AssessmentIcon from "@material-ui/icons/Assessment";
import SearchMenu from "./components/SearchMenu";
import SearchInput from "./components/SearchInput";
import { Grid } from "@material-ui/core";
import { initKeywords, addKeywords } from "../../store/actions/keywords";
import { getEmpData } from "../../store/actions/searchEMP";
import { isValid, getKeywords } from "../../shared/utility";
import { setCategory } from "../../store/actions/searchBar";

const useStyles = makeStyles((theme) => ({
  menu: {
    display: "flex",
    flexDirection: "row",
    gap: "15px",
  },

  home: {
    position: "relative",
    cursor: "pointer",
    width: 80,
    height: 30,
    flex: "1fr",
    border: "none",
    justifyContent: "space-between",
    "& span": {
      position: "absolute",
      right: 2,
      top: "50%",
      transform: "translateY(-50%)",
    },
    "& .icon_home": {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 29,
      height: 29,
    },
  },
  home_hover: {
    position: "relative",
    cursor: "pointer",
    width: 80,
    height: 30,
    flex: "1fr",
    justifyContent: "space-between",
    "& span": {
      position: "absolute",
      right: 2,
      top: "50%",
      transform: "translateY(-50%)",
    },
    "& .icon_home": {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 29,
      height: 29,
      border: "none",
    },
    borderBottom: "2px solid white",
  },
  statistics: {
    position: "relative",
    cursor: "pointer",
    flex: "2fr",
    width: 100,
    height: 30,
    border: "none",
    boxSizing: "content-box",
    justifyContent: "space-between",
    "& span": {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      right: 0,
    },
    "& .icon_statistics": {
      top: "50%",
      transform: "translateY(-50%)",
      position: "absolute",
      width: 28,
      height: 28,
    },
  },
  statistics_hover: {
    position: "relative",
    cursor: "pointer",
    flex: "2fr",
    width: 100,
    height: 30,
    boxSizing: "content-box",
    justifyContent: "space-between",
    "& span": {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      right: 0,
    },
    "& .icon_statistics": {
      top: "50%",
      transform: "translateY(-50%)",
      position: "absolute",
      width: 28,
      height: 28,
      border: "none",
    },
    borderBottom: "2px solid white",
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "block",
    fontSize: 20,

    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
  link_mobile: {
    color: "black",
    textDecoration: "none",
  },
  searchContainer: {
    position: "relative",
    width: "130%",
    transform: "translateX(5%)",
    [theme.breakpoints.only("sm")]: {
      width: "150%",
      transform: "translateX(-5%)",
    },
    [theme.breakpoints.only("xs")]: {
      width: "110%",
      transform: "translateX(-5%)",
    },
  },
  searchOption: {
    position: "relative",
    [theme.breakpoints.down("md")]: {
      transform: "translateX(20%)",
    },
  },
  searchButton: {
    position: "relative",
    transform: "translateX(-140%)",
    [theme.breakpoints.only("sm")]: {
      transform: "translateX(5%)",
    },
    [theme.breakpoints.only("xs")]: {
      transform: "translateX(40%)",
    },
  },
  submit: {
    position: "absolute",
    top: "50%",
    transform: "translate(-50%,-50%)",
    color: "white",
  },
  search_input: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    marginLeft: theme.spacing(3),
    width: "50%",
    [theme.breakpoints.only("sm")]: {
      marginLeft: theme.spacing(5),
      width: "80%",
    },
    [theme.breakpoints.only("xs")]: {
      marginLeft: theme.spacing(5),
      width: "80%",
    },
  },
  search_select: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    marginLeft: theme.spacing(3),
    width: "100%",
    [theme.breakpoints.only("sm")]: {
      marginLeft: theme.spacing(4.5),
      width: "80%",
    },
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
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",

    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    paddingLeft: 70,
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },

  navContainer: {},
  sectionMobile: {
    display: "block",
    position: "absolute",
    top: "50%",
    right: 0,
    transform: "translate(-50%,-50%)",
    [theme.breakpoints.down("sm")]: {
      transform: "translate(-25%,-50%)",
    },
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

const SearchBar = memo(() => {
  const classes = useStyles();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [hover, setHover] = useState();

  const dispatch = useDispatch();
  const keywords = useSelector((state) => state.keywords.keywords);
  const page = useSelector((state) => state.searchEMP.page);
  const option = useSelector((state) => state.searchBar.option);
  const inputVal = useSelector((state) => state.searchBar.inputVal);
  const optionVal = useSelector((state) => state.searchBar.optionVal);

  //name 보낼 때 띄어쓰기 제거하고 보내기
  //searchOption, searchOptionVal(searchDetail),searchInputVal은 리듀서로 몰아넣기.
  //useInput은 searchInput안에 넣고, debounce로 리듀서에 value저장되는 타이밍 조정
  //submit함수는 searchInput안에서 버튼 눌렀을 때 직접 호출하도록.
  // option, inputVal, optionVal, page

  useEffect(() => {
    if (keywords.length === 0) dispatch(initKeywords());
    dispatch(setCategory());
  }, []);

  const submitData = (e) => {
    e.preventDefault();
    if (option === "이름검색") {
      isValid(inputVal);
      dispatch(getEmpData(inputVal, page, "noPage"));
      dispatch(addKeywords("name", inputVal));
    } else {
      isValid(optionVal.value);
      console.log("page", page);
      dispatch(getEmpData(optionVal, page, "noPage"));
      dispatch(addKeywords(optionVal.category, optionVal.value));
    }
  };

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const setIndicator = (target) => {
    setHover(target);
  };

  const changeBarType = (mode) => {
    switch (mode) {
      case "desktop":
        return (
          <>
            {" "}
            <AssessmentIcon
              className={
                hover === "statistics"
                  ? `${classes.statistics_hover} icon_statistics`
                  : `${classes.statistics} icon_statistics`
              }
            />
            <Typography component="span" noWrap>
              <Link to="/statistics" className={classes.link}>
                통계 검색
              </Link>
            </Typography>
          </>
        );
      case "mobile":
        return (
          <>
            <AssessmentIcon />
            통계 검색
          </>
        );
      default:
        return;
    }
  };

  const mobileMenuId = "search-employee-menu-mobile";

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <Link to="/" className={classes.link_mobile}>
        <MenuItem>
          <HomeIcon />
          홈으로
        </MenuItem>
      </Link>
      <Link to="/statistics" className={classes.link_mobile}>
        <MenuItem>{changeBarType("mobile")}</MenuItem>
      </Link>
    </Menu>
  );

  {
    /********************구현 부분***************************/
  }
  return (
    <div className={classes.grow}>
      <AppBar position="fixed">
        <Toolbar>
          <Grid container direction="row" className={classes.toolbarContainer}>
            <Grid
              item
              xs={false}
              sm={false}
              md={2}
              className={classes.titleContainer}
            >
              <Typography className={classes.title}>Employee Mark</Typography>
            </Grid>
            <Grid item xs={10} sm={8} md={7} className={classes.formContainer}>
              <form
                onSubmit={(e) => {
                  submitData(e);
                }}
              >
                <Grid
                  container
                  direction="row"
                  className={classes.searchContainer}
                >
                  <Grid item xs={2} className={classes.searchOption}>
                    <SearchMenu />
                  </Grid>
                  <Grid item xs={8} className={classes.searchInputContainer}>
                    <SearchInput classes={classes} />
                  </Grid>
                  <Grid item xs={2} className={classes.searchButton}>
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
            </Grid>
            <Grid item xs={2} sm={2} md={3} className={classes.navContainer}>
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <div className={classes.menu}>
                  <div
                    className={
                      hover === "home" ? classes.home_hover : classes.home
                    }
                    onMouseEnter={() => setIndicator("home")}
                    onMouseLeave={() => setIndicator(null)}
                  >
                    <HomeIcon
                      className={
                        hover === "home"
                          ? `${classes.home_hover} icon_home`
                          : `${classes.home} icon_home`
                      }
                    />
                    <Typography component="span" noWrap>
                      <Link to="/" className={classes.link}>
                        홈으로
                      </Link>
                    </Typography>
                  </div>
                  <div
                    className={
                      hover === "statistics"
                        ? classes.statistics_hover
                        : classes.statistics
                    }
                    onMouseEnter={() => setIndicator("statistics")}
                    onMouseLeave={() => setIndicator(null)}
                  >
                    {changeBarType("desktop")}
                  </div>
                </div>
              </div>
              <div className={classes.sectionMobile}>
                <IconButton
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </div>
  );
});

export default SearchBar;
