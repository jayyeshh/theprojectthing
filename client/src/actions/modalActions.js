import { SET_MODAL_STATE } from "./action-types";

export const setModalStateAction = ({ showModal, text, severity = "info" }) => {
  return {
    type: SET_MODAL_STATE,
    payload: {
      showModal,
      text,
      severity,
    },
  };
};
