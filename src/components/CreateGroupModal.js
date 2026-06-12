import "../styles/createGroupModal.css";
import { FiX } from "react-icons/fi";

const CreateGroupModal = ({ open, onClose }) => {
    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="group-modal">
                <div className="modal-header">
                    <h2>Create Group</h2>

                    <button onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <div className="modal-body">
                    <input
                        type="text"
                        placeholder="Group Name"
                    />

                    <input
                        type="text"
                        placeholder="Search Users"
                    />

                    <div className="selected-users">
                        <span>Rahul ✕</span>
                        <span>Aman ✕</span>
                    </div>

                    <button className="create-group-btn">
                        Create Group
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;