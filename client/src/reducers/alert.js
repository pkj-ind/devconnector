import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];
/*since only one function we can put export default and 
we will get state from alert reducer, which is being returned.*/

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}