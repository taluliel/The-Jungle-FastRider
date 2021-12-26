import { ActionTypes } from "../constants/actionTypes";

const initialState = {
  users: [],
};

export const usersReducers = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SIGN_USER: {
      let allUsers = initialState.users;
      allUsers.push(payload);
      return { ...state, users: allUsers };
    }

    default:
      return state;
  }
};
