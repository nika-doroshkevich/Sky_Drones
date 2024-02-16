import React from 'react';
import "./Modal.css";

class Modal extends React.Component<{ isOpen: any, onConfirm: any, onClose: any, message: any }> {
    render() {
        let {isOpen, onConfirm, onClose, message} = this.props;
        if (!isOpen) return null;

        return (
            <div className="modal">
                <div className="modal-content">
                    <p>{message}</p>
                    <div className="modal-actions">
                        <button onClick={onConfirm} className="btn btn-primary">Yes</button>
                        <button onClick={onClose} className="btn btn-secondary">No</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;
