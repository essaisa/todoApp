import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <nav className="w-48 bg-gray-100 p-4 min-h-screen">
      <ul>
        <li className="mb-2">
          <Link to="/" className="block px-2 py-1 hover:bg-gray-200 rounded">
            Home
          </Link>
        </li>
        <li>
          <Link to="kanban" className="block px-2 py-1 hover:bg-gray-200 rounded">
            Task Board
          </Link>
        </li>
      </ul>
    </nav>
  );
}
