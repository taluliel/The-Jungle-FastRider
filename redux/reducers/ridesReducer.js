import { ActionTypes } from "../constants/actionTypes";

const initialState = {
  rides: [],
  selectedRide: {},
  ticketDetails: [],
};

export const rideReducers = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_RIDES:
      return { ...state, rides: payload };
    case ActionTypes.GET_ACCESS_CODE:
      return {
        ...state,
        ticketDetails: { PIN: payload.pin, ticket: payload.ride_details },
      };
    case ActionTypes.SET_SELECTED_RIDE:
      return { ...state, selectedRide: payload };
    default:
      return state;
  }
};
