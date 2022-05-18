import { useState, createContext, useCallback, useContext } from 'react';
import ErrorMessage from '../components/ErrorMessage';

const defaultModalState = {
  isOpen: false,
  data: {
    title: 'Error found',
    description: '',
    message: '',
  },
  okButton: {
    onClick: (_event) => {},
    label: 'Ok',
  },
  cancelButton: {
    onClick: (_event) => {},
    label: 'Cancel',
  },
};

const ErrorModalContext = createContext({
  modalState: defaultModalState,
  showModal: (_data) => {},
  closeModal: () => {},
});

export const useErrorModal = () => useContext(ErrorModalContext);

export function ErrorModalProvider({ children }) {
  const [modalState, setModalState] = useState(defaultModalState);

  const showModal = useCallback(
    (newModalState) => {
      setModalState(() => {
        const data = Object.assign(
          {},
          defaultModalState.data,
          newModalState.data || {}
        );

        const okButton = Object.assign(
          {},
          defaultModalState.okButton,
          newModalState.okButton || {}
        );

        const cancelButton = Object.assign(
          {},
          defaultModalState.cancelButton,
          newModalState.cancelButton || {}
        );

        return {
          isOpen: true,
          data,
          okButton,
          cancelButton,
        };
      });
    },
    [setModalState]
  );

  const closeModal = useCallback(() => {
    setModalState(defaultModalState);
  }, [setModalState]);

  return (
    <ErrorModalContext.Provider value={{ modalState, showModal, closeModal }}>
      {children}
      <ErrorModal />
    </ErrorModalContext.Provider>
  );
}

function ErrorModal() {
  const {
    modalState: { isOpen, data, okButton, cancelButton },
    closeModal,
  } = useErrorModal();

  return (
    isOpen && (
      <ErrorMessage>
        <ErrorMessage.Title>{data.title}</ErrorMessage.Title>
        <ErrorMessage.Description>{data.description}</ErrorMessage.Description>
        <ErrorMessage.Body>{data.message}</ErrorMessage.Body>
        <ErrorMessage.Footer>
          <button
            onClick={(event) => {
              cancelButton.onClick(event);
              closeModal();
            }}
          >
            {cancelButton.label}
          </button>
          &nbsp;&nbsp;
          <button
            onClick={(event) => {
              okButton.onClick(event);
              closeModal();
            }}
          >
            {okButton.label}
          </button>
        </ErrorMessage.Footer>
      </ErrorMessage>
    )
  );
}
