import * as actionTypes from "../actions/actionTypes";
import {
  initKeywords,
  addKeywords,
  deleteKeywords,
  openKeywords,
} from "../../shared/utility";

const initState = {
  keywords: ["recent keyword"],
  open: false,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.KEYWORDS_INIT:
      return initKeywords(state);
    case actionTypes.KEYWORDS_ADD:
      return addKeywords(state, action.category, action.keyword);
    case actionTypes.KEYWORDS_DELETE:
      return deleteKeywords(state, action.identifier);
    case actionTypes.KEYWORDS_OPEN:
      return openKeywords(state, action.bool);
    default:
      return state;
  }
};

export default reducer;
