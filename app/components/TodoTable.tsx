import { Todo } from "@prisma/client";
import { useState } from "react";

interface TodoTableProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (todo: Todo) => void;
}

export default function TodoTable({ todos, onEdit, onDelete, onToggleComplete }: TodoTableProps) {
  // State to keep track of the current page
  const [currentPage, setCurrentPage] = useState(1);
  // Number of todos to show per page
  const todosPerPage = 10;
  // Total number of pages
  const totalPages = Math.ceil(todos.length / todosPerPage);

  // Calculate the start index for the current page
  const startIndex = (currentPage - 1) * todosPerPage;
  // Get the todos to display on the current page
  const displayTodos = todos.slice(startIndex, startIndex + todosPerPage);

  // Function to go to the next page
  const handleNextPage = () => {
    // If the current page is not the last page, go to the next page
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to go to the previous page
  const handlePreviousPage = () => {
    // If the current page is not the first page, go to the previous page
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // The table component
  return (
    <div className="overflow-x-auto">
      {/* 
        This table component renders a list of todos.
        It displays the title, description, and completed status of each todo.
        It also renders a checkbox to toggle the completed status of each todo.
        The table is paginated, with 10 todos per page.
        The user can navigate between pages using the "Previous" and "Next" buttons.
      */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {/* 
                This column displays a checkbox to toggle the completed status of each todo.
              */}
              Complete
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {/* 
                This column displays the title of each todo.
              */}
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {/* 
                This column displays the description of each todo.
              */}
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {/* 
                This column displays the actions for each todo, including a button to edit the todo
                and a button to delete the todo.
              */}
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayTodos.map((todo) => (
            <tr key={todo.id} className="text-gray-900">
              <td className="px-6 py-4 text-sm leading-5 text-gray-900">
                {/* 
                  This checkbox toggles the completed status of the todo.
                */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => onToggleComplete(todo)}
                />
              </td>
              <td className={`px-6 py-4 text-sm leading-5 ${todo.completed ? "line-through" : ""} text-gray-900`}>
                {/* 
                  This column displays the title of the todo.
                */}
                {todo.title}
              </td>
              <td className={`px-6 py-4 text-sm leading-5 ${todo.completed ? "line-through" : ""} text-gray-900`}>
                {/* 
                  This column displays the description of the todo.
                */}
                {todo.description}
              </td>
              <td className="px-6 py-4 text-sm leading-5 text-gray-900">
                {/* 
                  This column displays the actions for the todo, including a button to edit the todo
                  and a button to delete the todo.
                */}
                <div className="flex space-x-8">
                  <button
                    onClick={() => onEdit(todo)}
                    disabled={todo.completed}
                    className={`flex items-center space-x-1 bg-blue-500 text-white px-4 py-2 rounded ${todo.completed ? "opacity-50" : ""}`}
                  >
                    {/* 
                      This button edits the todo.
                    */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button onClick={() => onDelete(todo.id)} className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded">
                    {/* 
                      This button deletes the todo.
                    */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50"
        >
          {/* 
            This button navigates to the previous page of todos.
          */}
          Previous
        </button>
        <span className="text-sm text-gray-700">
          {/* 
            This span displays the current page number and the total number of pages.
          */}
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50"
        >
          {/* 
            This button navigates to the next page of todos.
          */}
          Next
        </button>
      </div>
    </div>
  );
}