"use client";

import { useState, useEffect } from "react";
import TodoTable from "./components/TodoTable";
import TodoModal from "./components/TodoModal";
import ConfirmModal from "./components/ConfirmModal";
import { Todo } from "@prisma/client";
import { toast } from "react-toastify";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const limit = 10;

  const fetchTodos = async () => {
    try {
      const res = await fetch(`/api/todos?limit=${limit}`);
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      const data = await res.json();
      setTodos(data.todos);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch todos");
    }
  };

  useEffect(() => {
    fetchTodos();
  });

  const handleAddOrEdit = async (data: { title: string; description: string; completed?: boolean }) => {
    try {
      let res;
      if (selectedTodo) {
        res = await fetch(`/api/todos/${selectedTodo.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          toast.success("Todo updated successfully");
        } else {
          const errorData = await res.json();
          toast.error(errorData.message || "Update failed");
        }
      } else {
        const res = await fetch(`/api/todos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          toast.success("Todo created successfully");
        } else {
          const errorData = await res.json();
          toast.error(errorData.message || "Creation failed");
        }
      }
      await fetchTodos();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setSelectedTodo(null);
    }
  };

  const triggerDelete = (id: string) => {
    setTodoToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!todoToDelete) return;
    try {
      const res = await fetch(`/api/todos/${todoToDelete}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Todo deleted successfully");
        await fetchTodos();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    } finally {
      setTodoToDelete(null);
      setIsConfirmOpen(false);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });
      if (res.ok) {
        toast.success("Todo marked as completed");
        await fetchTodos();
      }
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-gray-900 font-bold mb-4">Todo App</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Add Todo
      </button>
      <TodoTable
        todos={todos}
        onEdit={(todo) => {
          setSelectedTodo(todo);
          setIsModalOpen(true);
        }}
        onDelete={triggerDelete}
        onToggleComplete={handleToggleComplete}
      />
      <TodoModal
        todo={selectedTodo || undefined}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTodo(null);
        }}
        onSubmit={handleAddOrEdit}
      />
      <ConfirmModal
        isOpen={isConfirmOpen}
        message="Are you sure you want to delete this todo?"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setTodoToDelete(null);
        }}
      />
    </div>
  );
}
