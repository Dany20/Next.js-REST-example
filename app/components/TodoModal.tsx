"use client";

import { useState, useEffect, useCallback } from "react";
import { Todo } from "@prisma/client";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";

interface TodoModalProps {
  todo?: Todo;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; completed?: boolean }) => void;
}

export default function TodoModal({
  todo,
  isOpen,
  onClose,
  onSubmit,
}: TodoModalProps) {
  const [title, setTitle] = useState(""); // Initialize state for the title input field
  const [description, setDescription] = useState(""); // Initialize state for the description input field
  const [titleError, setTitleError] = useState<string | null>(null); // State to store errors related to the title

  useEffect(() => {
    // Effect to prefill the form if a todo is provided
    if (todo) {
      setTitle(todo.title); // Set title to the existing todo's title
      setDescription(todo?.description ?? ""); // Set description, defaulting to empty string if undefined
    } else {
      setTitle(""); // Reset title if no todo is provided
      setDescription(""); // Reset description if no todo is provided
    }
  }, [todo]);

  // Function to check title uniqueness via API   
  const checkTitleExists = async (titleToCheck: string) => {
    try {
      const res = await fetch(
        `/api/todos/exists?title=${encodeURIComponent(titleToCheck)}`
      );
      const data = await res.json();
      return data.exists; // Return true if the title exists
    } catch (error) {
      console.error("Error checking title:", error);
      return false; // Assume title doesn't exist if error occurs
    }
  };

  // Debounced function to validate title live
  const debouncedValidateTitle = useCallback(
    debounce(async (currentTitle: string) => {
      if (currentTitle.trim() === "") {
        setTitleError(null); // Clear error if title is empty
        return;
      }
      const normalizedTitle = currentTitle.trim().toLowerCase().replace(/\s+/g, " ");
      const exists = await checkTitleExists(normalizedTitle);
      if (exists) {
        setTitleError("A todo with this title already exists."); // Set error if title is not unique
      } else {
        setTitleError(null); // Clear error if title is unique
      }
    }, 500),
    [checkTitleExists, setTitleError] // Dependencies for the useCallback hook
  );

  useEffect(() => {
    debouncedValidateTitle(title); // Call debounced validation on title change
    return () => {
      debouncedValidateTitle.cancel(); // Cancel debounced calls on unmount
    };
  }, [title, debouncedValidateTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required"); // Show error if title is empty
      return;
    }
    onSubmit({
      title: title.trim(), // Submit trimmed title
      description: description.trim(), // Submit trimmed description
      completed: todo?.completed || false, // Preserve completed status if editing
    });
    onClose(); // Close the modal
    setTitle(""); // Reset title
    setDescription(""); // Reset description
  };

  if (!isOpen) return null; // Return nothing if modal is not open

  return (
    <div
      className="fixed inset-0 bg-gray-900 z-10"
      style={{ backgroundColor: "rgba(17, 24, 39, 0.5)" }}
      onClick={onClose}
    >
      {/* This div is used to create the dark background of the modal */}
      <div className="fixed inset-0" aria-hidden="true" />
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 sm:max-w-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* This div is the content of the modal */}
        <h2 className="text-xl text-black mb-4">
          {todo ? "Edit Todo" : "Add Todo"} {/* Dynamic heading based on mode */}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)} // Update title state on change
              className={`mt-1 block w-full border rounded-md p-2 text-black focus:outline-none ${
                titleError
                  ? "border-red-500" // Red border if there's an error
                  : title.trim() !== ""
                  ? "border-green-500" // Green border if title is valid
                  : "border-gray-300" // Default gray border
              }`}
            />
            {titleError && (
              <p className="text-red-500 text-sm mt-1">{titleError}</p> // Display title error
            )}
          </div>
          <div className="mb-4">
            <label className="block text-black">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)} // Update description state on change
              className="mt-1 block w-full border rounded-md p-2 text-black focus:outline-none border-gray-300"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose} // Close modal without submitting
              className="px-4 py-2 bg-gray-300 rounded text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!!titleError} // Disable submit if there's an error
              className={`px-4 py-2 bg-blue-600 text-white rounded ${
                titleError ? "opacity-50 cursor-not-allowed" : "" // Style disabled button
              }`}
            >
              {todo ? "Update" : "Create"} {/* Dynamic button text based on mode */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}