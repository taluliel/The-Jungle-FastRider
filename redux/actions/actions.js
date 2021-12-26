import { ActionTypes } from "../constants/actionTypes";

export const setRides = (rides) => {
  return {
    type: ActionTypes.SET_RIDES,
    payload: rides,
  };
};

export const setSelctedRide = (ride) => {
  return {
    type: ActionTypes.SET_SELECTED_RIDE,
    payload: ride,
  };
};
export const FastRiderAccessCode = (ride_details, pin) => {
  return {
    type: ActionTypes.GET_ACCESS_CODE,
    payload: { ride_details, pin },
  };
};
export const signUser = (user) => {
  return {
    type: ActionTypes.SIGN_USER,
    payload: user,
  };
};
