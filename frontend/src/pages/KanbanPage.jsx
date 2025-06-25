import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const Column = ({ title, headingColor, column, cards }) => {
  return (
    <div className="w-64 shrink-0 bg-stone-100 p-4 rounded shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-semibold ${headingColor}`}>{title}</h3>
        <span className="text-sm text-neutral-500">{cards.length}</span>
      </div>
      <div className="space-y-2">
        {cards.map((card) => (
          <div key={card._id} className="bg-white p-3 rounded shadow-sm">
            <p className="font-medium">{card.text}</p>
            <p className="text-xs text-gray-500">
              {card.dueDate ? `Due: ${new Date(card.dueDate).toLocaleDateString()}` : ""}
              {card.priority ? ` | Priority: ${card.priority}` : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Kanban({ token }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:8080/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, [token]);

  const columns = {
    todo: tasks.filter((task) => task.status === "todo"),
    doing: tasks.filter((task) => task.status === "doing"),
    done: tasks.filter((task) => task.status === "completed" || task.status === "done"),
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <div className="flex gap-4 overflow-x-auto">
          <Column title="To Do" headingColor="text-red-600" column="todo" cards={columns.todo} />
          <Column title="In Progress" headingColor="text-blue-600" column="doing" cards={columns.doing} />
          <Column title="Completed" headingColor="text-emerald-600" column="done" cards={columns.done} />
        </div>
      </div>
    </div>
  );
}
