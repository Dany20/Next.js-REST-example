// components/ConfirmModal.tsx
// This component renders a confirmation modal that displays a message and provides "Confirm" and "Cancel" options.

import React from "react";

// Define the properties expected by the ConfirmModal component
interface ConfirmModalProps {
  isOpen: boolean; // Determines if the modal is visible
  message: string; // Message to display in the modal
  onConfirm: () => void; // Callback for the "Confirm" button
  onCancel: () => void; // Callback for the "Cancel" button or clicking outside
}

// ConfirmModal functional component
export default function ConfirmModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  // If the modal is not open, do not render anything
  if (!isOpen) return null;

  return (
    <div
      // Background overlay that darkens the rest of the page when modal is open
      className="fixed inset-0 bg-gray-900 z-10"
      style={{ backgroundColor: "rgba(17, 24, 39, 0.5)" }}
      onClick={onCancel} // Dismiss modal when clicking the overlay
    >
      <div className="fixed inset-0" aria-hidden="true" />
      <div
        // Modal container centered on the screen
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <p className="mb-4 text-black">{message}</p> {/* Display the message */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded text-black"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

