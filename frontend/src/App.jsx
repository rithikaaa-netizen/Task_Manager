import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);

  // Add Task
  const addTask = () => {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      due_date: date && time ? new Date(`${date}T${time}`) : null,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
  };

  // Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Toggle Complete
  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Drag & Drop reorder
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  // Filtered Tasks
  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .sort((a, b) => a.completed - b.completed); // completed go last

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Task Manager</h1>

      {/* Two Equal Panels */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch max-w-6xl mx-auto">

        {/* Left Panel */}
        <div className="flex-1 bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Create Task</h2>

          <input
            type="text"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg bg-gray-700"
          />

          <textarea
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg bg-gray-700 h-28"
          />

          <div className="flex gap-4 mb-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-gray-700"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-gray-700"
            />
          </div>

          <div className="flex gap-4 mt-auto">
            <button
              onClick={() => {
                setTitle("");
                setDescription("");
                setDate("");
                setTime("");
              }}
              className="flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-lg"
            >
              Clear
            </button>
            <button
              onClick={addTask}
              className="flex-1 bg-green-500 hover:bg-green-600 py-3 rounded-lg"
            >
              Add
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>

          {/* Search + Filter */}
          <div className="flex gap-2 mb-3">
            <input
              className="flex-1 p-2 rounded bg-gray-700"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="p-2 rounded bg-gray-700"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Scrollable Task List */}
          <div className="overflow-y-auto flex-1 pr-1">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {filteredTasks.length === 0 ? (
                      <p className="text-gray-400">No tasks yet...</p>
                    ) : (
                      filteredTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className={`flex justify-between items-center p-3 mb-2 rounded-lg transition ${
                                snapshot.isDragging
                                  ? "bg-gray-600 shadow-lg"
                                  : "bg-gray-700"
                              }`}
                            >
                              <div>
                                <h3
                                  className={`font-semibold ${
                                    task.completed
                                      ? "line-through text-gray-400"
                                      : ""
                                  }`}
                                >
                                  {task.title}
                                </h3>
                                <p className="text-sm text-gray-300">
                                  {task.description}
                                </p>
                                {task.due_date && (
                                  <p className="text-xs text-gray-400">
                                    Due:{" "}
                                    {new Date(task.due_date).toLocaleString()}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => toggleComplete(task.id)}
                                  className={`px-3 py-1 rounded-lg ${
                                    task.completed
                                      ? "bg-yellow-500 hover:bg-yellow-600"
                                      : "bg-blue-500 hover:bg-blue-600"
                                  }`}
                                >
                                  {task.completed ? "Undo" : "Complete"}
                                </button>
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => setSelectedTask(task)}
                                  className="bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded-lg"
                                >
                                  ℹ
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl w-96">
            <h2 className="text-lg font-bold">{selectedTask.title}</h2>
            <p className="mt-2 text-gray-300">
              {selectedTask.description || "No description"}
            </p>
            {selectedTask.due_date && (
              <p className="text-sm text-gray-400 mt-2">
                Due: {new Date(selectedTask.due_date).toLocaleString()}
              </p>
            )}
            <button
              onClick={() => setSelectedTask(null)}
              className="mt-4 bg-red-600 px-4 py-2 rounded hover:bg-red-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
