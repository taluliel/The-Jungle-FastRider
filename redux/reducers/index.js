import { combineReducers } from "redux";
import { rideReducers } from "./ridesReducer";
import { usersReducers } from "./usersReducer";

const reducers = combineReducers({
  allData: rideReducers,
  users: usersReducers,
});

export default reducers;
