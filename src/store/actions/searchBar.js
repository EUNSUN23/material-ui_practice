import * as actionTypes from "../actions/actionTypes";
import axios from "axios";

// <-- setCategory -->

const initCategory = (data) => {
  return { type: actionTypes.BAR_INIT_CATEGORY, category: data };
};

const getDeptAPI = async () => {
  const deptRes = await axios.get("http://localhost:3008/api/dept");

  return deptRes.data.packet;
};

const getTitleAPI = async () => {
  const titleRes = await axios.get("http://localhost:3008/api/title");

  return titleRes.data.packet;
};

const getCategoryAPI = async () => {
  const res = await Promise.all([getDeptAPI(), getTitleAPI()]);
  return { dept: res[0], title: res[1] };
};

export const setCategory = () => {
  return async (dispatch) => {
    let category;
    const res = await getCategoryAPI();
    if (res) {
      console.log(res.dept);
      const deptList = res.dept.map((obj, idx) => {
        console.log(obj.dept_name);
        return obj.dept_name;
      });

      console.log(res.title);
      const titleList = res.title.map((obj, idx) => {
        console.log(obj.title);
        return obj.title;
      });

      category = {
        dept: deptList,
        title: titleList,
      };
      console.log("CATEGORY", category);
      dispatch(initCategory(category));
    } else {
      return;
    }
  };
};

// <-- setOption -->

export const setOption = (option) => {
  console.log("SET_OPTION", actionTypes.BAR_SET_OPTION);
  return { type: actionTypes.BAR_SET_OPTION, option: option };
};

// <-- setValue -->

export const setOptVal = (selected) => {
  return { type: actionTypes.BAR_OPT_VAL, selected: selected };
};

export const setInpVal = (name) => {
  return { type: actionTypes.BAR_INP_VAL, name: name };
};

export const initOptVal = () => {
  return { type: actionTypes.BAR_INIT_OPT };
};