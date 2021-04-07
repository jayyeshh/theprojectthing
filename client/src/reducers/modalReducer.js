import { SET_MODAL_STATE } from "../actions/action-types";

const initialState = {
  showModal: false,
  text: "",
};

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MODAL_STATE: {
      return {
        ...state,
        showModal: action.payload.showModal,
        text: action.payload.text,
      };
    }
    default:
      return state;
  }
};

export default modalReducer;
