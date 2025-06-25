import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../utils/api";

export const Kanban = ({ token, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    API.get('/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, [token]);

  const columns = {
    todo: tasks.filter(t => t.status === 'todo'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow p-6">
        <header className="mb-4 flex justify-between items-center border-b pb-4">
          <h1 className="text-3xl font-extrabold">Tasks</h1>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            Logout
          </button>
        </header>

        <div className="flex gap-4 overflow-auto h-full">
          {Object.entries(columns).map(([col, items]) => (
            <div key={col} className="w-64 bg-gray-50 rounded p-2">
              <h2 className="font-semibold mb-2 capitalize">{col}</h2>
              {items.map(card => (
                <div key={card._id} className="bg-white p-2 rounded shadow mb-2">
                  <p className="font-medium">{card.text}</p>
                  <small className="text-gray-500">
                    {card.dueDate && `Due: ${new Date(card.dueDate).toLocaleDateString()}`}
                    {card.priority && ` | ${card.priority}`}
                  </small>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
