import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-48 bg-gray-800 text-white min-h-screen p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">TaskTracker</h2>
      <Link to="/" className="mb-4 hover:underline">Home</Link>
      <Link to="/kanban" className="hover:underline">Tasks</Link>
    </div>
  );
}
