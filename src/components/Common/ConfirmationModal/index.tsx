import React from "react";
import Modal, { ModalProps } from "react-bootstrap/Modal";
import clsx from "clsx";
import "./conformationmodel.css";
// import {ConfirmationModal} from "./ConfirmationModal.styled"
const ConfirmationModal: React.FC<ModalProps> = ({
  variant,
  description,
  confirmLabel,
  cancelLabel,
  onConfirmClick,
  onHide = () => {},
  ...rest
}) => {
  return (
    <Modal {...rest} className="conformation-model-box" size="sm" centered>
      <div className="conformation-model">
        <Modal.Body>
          <p className={clsx({ "text-danger": variant === "danger" })}>
            {description}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-end">
            {!!cancelLabel && (
              <button className="cancel-btn" onClick={onHide}>
                {cancelLabel}
              </button>
            )}
            {!!confirmLabel && (
              <button className="delete-btn" onClick={onConfirmClick}>
                {confirmLabel}
              </button>
            )}
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
