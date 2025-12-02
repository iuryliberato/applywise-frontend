import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="delete-modal-backdrop">
      <div className="delete-modal-card">
        <h2 className="delete-modal-title">Delete application?</h2>
        <p className="delete-modal-text">
          This action cannot be undone. Are you sure you want to delete this application?
        </p>

        <div className="delete-modal-actions">
          <button className="delete-modal-btn cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="delete-modal-btn confirm" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
