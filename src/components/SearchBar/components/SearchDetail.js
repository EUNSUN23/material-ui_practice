import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { setOptVal } from "../../../store/actions/searchBar";
import { deleteKeyword } from "../../../store/actions/keywords";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import theme from "../../../theme";

const useStyles = makeStyles(() => ({
  title_container: {
    position: "relative",
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "35ch",
    },
    height: "35px",
  },
  title_listItemIcon: {
    position: "absolute",
    left: "0%",
    color: "white",
    height: "100%",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title_listItemText: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    position: "relative",
    transition: theme.transitions.create("width"),
    width: "30ch",
    [theme.breakpoints.only("sm")]: {
      width: "40ch",
    },
    height: "30px",
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
    "&.menu_disabled": {
      textAlign: "center",
    },
  },
}))(MenuItem);

const SearchDetail = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [clearBtn, setClearBtn] = useState(false);
  const [optTitle, setOptTitle] = useState(null);
  const [category, setCategory] = useState(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const categoryObj = useSelector((state) => state.searchBar.category);
  const option = useSelector((state) => state.searchBar.option);
  const optionVal = useSelector((state) => state.searchBar.optionVal);
  const keywords = useSelector((state) => state.keywords.keywords);

  useEffect(() => {
    console.log("useEffect");
    switch (option) {
      case "직급검색":
        setCategory(categoryObj.title);
        return;
      case "부서검색":
        setCategory(categoryObj.dept);
        return;
      case "최근검색":
        setCategory(keywords);
        return;
    }
  }, [option]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickDel = (e, identifier) => {
    e.preventDefault();
    dispatch(deleteKeyword(identifier));
  };

  const handleOptionValue = (value) => {
    handleClose();
    dispatch(setOptVal(value));
  };

  const createDetailList = (arr, arrType) => {
    let resultList;
    console.log("ARR_TYPE", arrType);
    if (arrType === "recent keyword") {
      const sortedArr = arr.sort((a, b) => {
        return b.index - a.index;
      });

      const valueArr = sortedArr.map((el, idx) => {
        return el.value;
      });

      const reducedArr = valueArr.reduce((accumulator, current) => {
        const length = accumulator.length;
        if (length === 0 || accumulator.indexOf(current) <= -1) {
          current && accumulator.push(current);
        }
        return accumulator;
      }, []);

      resultList = reducedArr.slice(0, 5).map((el, idx) => {
        const index = valueArr.indexOf(el);
        return { category: arr[index].category, value: el };
      });
    } else {
      resultList = arr;
    }

    const searchDetail = resultList.map((item, idx) => {
      return (
        <StyledMenuItem
          key={`category_${item.index}`}
          disabled={category.length <= 1 ? true : false}
          className={
            category.length <= 1 ? `${StyledMenuItem.root} menu_disabled` : null
          }
          onClick={() => {
            handleOptionValue({ category: item.category, value: item.value });
          }}
        >
          <ListItemText primary={item.value} />
          {clearBtn && category.length > 1 ? (
            <DeleteForeverIcon
              size="small"
              onClick={(e) => onClickDel(e, item.index)}
            />
          ) : null}
        </StyledMenuItem>
      );
    });

    return searchDetail;
  };

  const createSearchDetail = () => {
    if (category) {
      console.log("category", category);
      const newTitle = category[0];
      let detailList;
      if (optTitle === null || optTitle !== newTitle) {
        setOptTitle(newTitle);
        // q. 첫 렌더시에만 전환이 느린 이유?
      }

      if (newTitle === "recent keyword") {
        console.log("keywords", category);
        detailList =
          category.length > 1
            ? category.slice(1)
            : [{ index: 0, value: "최근 검색내역이 없습니다" }];
        clearBtn === false && setClearBtn(true);
        return createDetailList(detailList, newTitle);
      } else {
        console.log("new TItle", newTitle);
        detailList = category
          .map((el, idx) => ({ category: category[0], index: idx, value: el }))
          .slice(1);
        clearBtn === true && setClearBtn(false);
      }

      return createDetailList(detailList, newTitle);
    } else {
      return;
    }
  };

  return (
    <div>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
        className={classes.title_container}
      >
        <ListItemIcon className={classes.title_listItemIcon}>
          <ArrowDropDownIcon fontSize="large" />
        </ListItemIcon>
        <ListItemText
          primary={optionVal ? optionVal.value : optTitle}
          className={classes.title_listItemText}
        />
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {createSearchDetail()}
      </StyledMenu>
    </div>
  );
};

export default SearchDetail;
