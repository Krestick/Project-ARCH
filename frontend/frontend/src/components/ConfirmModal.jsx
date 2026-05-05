import "./ConfirmModal.css";

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
