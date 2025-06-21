function TaskCategoryCircles() {
    const categories = [
      { name: "To-Do", color: "bg-blue-500" },
      { name: "In Progress", color: "bg-yellow-500" },
      { name: "Complete", color: "bg-green-500" },
    ];
  
    return (
      <div className="flex justify-around items-center mt-12 px-4">
        {categories.map((cat) => (
          <div key={cat.name} className="flex flex-col items-center space-y-2">
            <div
              className={`w-24 h-24 ${cat.color} rounded-full flex items-center justify-center text-white font-bold shadow-md hover:scale-105 transition cursor-pointer`}
            >
              {cat.name.split(" ").map((word, i) => (
                <span key={i} className="block text-sm">
                  {word}
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-700">{cat.name}</span>
          </div>
        ))}
      </div>
    );
  }
  
  export default TaskCategoryCircles;
  
