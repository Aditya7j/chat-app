import "../styles/deleteChatModal.css";
import { Oval } from "react-loader-spinner";

const DeleteChatModal = ({
    open,
    onClose,
    onDelete,
    deleting,
}) => {

    if (!open) return null;

    return (
        <div
            className="delete-modal-overlay"
            onClick={onClose}
        >
            <div
                className="delete-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                <h3>
                    Delete Chat
                </h3>

                <p>
                    Are you sure you want to
                    delete this chat?
                </p>

                <div className="delete-modal-actions">

                    <button
                        className="cancel-delete-btn"
                        onClick={onClose}
                        disabled={deleting}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-delete-btn"
                        onClick={onDelete}
                        disabled={deleting}
                    >
                        {deleting ? (
                            <Oval
                                height={18}
                                width={18}
                                color="#ffffff"
                                secondaryColor="#ffffff"
                                strokeWidth={5}
                            />
                        ) : (
                            "Delete"
                        )}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default DeleteChatModal;