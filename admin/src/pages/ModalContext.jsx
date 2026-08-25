/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useCallback, useContext } from "react";
import ConfirmationModal from "../components/ConfirmationModal";

const ModalContext = createContext();

export const useConfirmationModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const confirm = useCallback((options) => {
    setModalState({ isOpen: true, ...options });
  }, []);

  const handleClose = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    modalState.onConfirm();
    handleClose();
  };

  return (
    <ModalContext.Provider value={confirm}>
      {children}
      <ConfirmationModal {...modalState} onClose={handleClose} onConfirm={handleConfirm} />
    </ModalContext.Provider>
  );
};