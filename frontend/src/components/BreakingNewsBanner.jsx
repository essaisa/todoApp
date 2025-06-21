import { useEffect, useState } from "react";

function BreakingNewsBanner({ tasks = [] }) {
  const [index, setIndex] = useState(0);

  // Rotate every 4 seconds
  useEffect(() => {
    if (tasks.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % tasks.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tasks]);

  if (!tasks.length) return null;

  const currentTask = tasks[index];

  return (
    <div className="fixed top-0 left-0 w-screen bg-yellow-400 text-black py-2 px-4 flex justify-center items-center z-50">
      <p className="text-center font-medium text-sm sm:text-base">
        Upcoming: <strong>{currentTask.title}</strong> due by <em>{currentTask.dueDate}</em>
      </p>
    </div>
  );
}

export default BreakingNewsBanner;
