import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function LandingPage({ token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedText, setEditedText] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");

  const [filter, setFilter] = useState("all"); // all, active, completed
  const [sortBy, setSortBy] = useState(""); // dueDate, priority

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    setLoading(false);
  };

  const handleAddTask = async () => {
    if (!newTaskText.trim()) {
      alert("Please enter a task description");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: newTaskText,
          dueDate: newDueDate ? new Date(newDueDate).toISOString() : null,
          priority: newPriority,
          status: "todo",
        }),
      });

      if (res.ok) {
        const { task_id } = await res.json();
        setTasks((prev) => [
          ...prev,
          {
            _id: task_id,
            text: newTaskText,
            dueDate: newDueDate,
            priority: newPriority,
            status: "todo",
          },
        ]);
        setNewTaskText("");
        setNewDueDate("");
        setNewPriority("Medium");
        setShowAddForm(false);
      } else {
        alert("Failed to add task");
      }
    } catch (error) {
      console.error("Add task error:", error);
    }
  };

  const handleUpdateTask = async (id, updatedFields) => {
    try {
      const res = await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });
      if (res.ok) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === id ? { ...task, ...updatedFields } : task
          )
        );
      } else {
        alert("Failed to update task");
      }
    } catch (error) {
      console.error("Update task error:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setTasks((prev) => prev.filter((task) => task._id !== id));
      } else {
        alert("Failed to delete task");
      }
    } catch (error) {
      console.error("Delete task error:", error);
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditedText(task.text);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditedText("");
  };

  const saveEditing = () => {
    if (!editedText.trim()) return;
    handleUpdateTask(editingTaskId, { text: editedText });
    cancelEditing();
  };

  const toggleCompleted = (task) => {
    const newStatus = task.status === "completed" ? "todo" : "completed";
    handleUpdateTask(task._id, { status: newStatus });
  };

  const incompleteTasksCount = tasks.filter(
    (task) => task.status !== "completed"
  ).length;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.status === "completed";
    if (filter === "active") return task.status !== "completed";
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === "priority") {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const activeCount = tasks.length - completedCount;

  const pieData = [
    { name: "Completed", value: completedCount },
    { name: "Active", value: activeCount },
  ];
  const COLORS = ["#4ade80", "#f87171"];

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col min-h-screen font-mono">
      <header className="mb-4 flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-extrabold">Task Tracker</h1>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
        >
          Logout
        </button>
      </header>

      <section className="mb-6 p-4 bg-blue-100 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Hello!</h2>
        <p>
          You have{" "}
          <span className="font-bold text-blue-700">{incompleteTasksCount}</span>{" "}
          task{incompleteTasksCount !== 1 ? "s" : ""} to complete.
        </p>
      </section>

      <section className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <label className="font-semibold">Filter:</label>
          <button onClick={() => setFilter("all")} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
            All
          </button>
          <button onClick={() => setFilter("active")} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
            Active
          </button>
          <button onClick={() => setFilter("completed")} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
            Completed
          </button>
        </div>

        <div className="flex gap-2">
          <label className="font-semibold">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 rounded border"
          >
            <option value="">None</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </section>

      {!showAddForm && (
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
          >
            Add New Task
          </button>
        </div>
      )}

      {showAddForm && (
        <section className="mb-6 p-6 border-gray-200 rounded shadow bg-white max-w-md">
          <h3 className="text-lg font-semibold mb-4">New Task Details</h3>
          <label className="block mb-2 font-semibold" htmlFor="taskText">Task</label>
          <input
            id="taskText"
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
            placeholder="Enter task description"
          />
          <label className="block mb-2 font-semibold" htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
          />
          <label className="block mb-2 font-semibold" htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-6"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-400 rounded">Cancel</button>
            <button onClick={handleAddTask} className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
          </div>
        </section>
      )}

      <section className="flex-grow overflow-auto">
        {loading ? (
          <p>Loading tasks...</p>
        ) : sortedTasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet. Add one above!</p>
        ) : (
          <ul className="divide-y divide-gray-300 border rounded shadow-sm">
            {sortedTasks.map((task) => (
              <li
                key={task._id}
                className={`flex items-center justify-between p-4 ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-800 line-through"
                    : "bg-white"
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => toggleCompleted(task)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  {editingTaskId === task._id ? (
                    <input
                      type="text"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="border rounded px-2 py-1 flex-grow"
                      autoFocus
                    />
                  ) : (
                    <div className="flex flex-col flex-grow">
                      <span>{task.text}</span>
                      {(task.dueDate || task.priority) && (
                        <small className="text-gray-500 mt-1">
                          {task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : ""}
                          {task.dueDate && task.priority ? " | " : ""}
                          {task.priority ? `Priority: ${task.priority}` : ""}
                        </small>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {editingTaskId === task._id ? (
                    <>
                      <button
                        onClick={saveEditing}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-3 py-1 bg-gray-400 text-white rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(task)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <br/>

      <section className="mb-6 p-4 bg-white rounded shadow flex justify-center">
        <PieChart width={250} height={250}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </section>
    </div>
  );
}