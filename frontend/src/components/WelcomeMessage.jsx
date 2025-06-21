function WelcomeMessage({ userName, tasksNumber }) {
    // If user exists
    const greeting = !userName
      ? `Welcome back, you have ${tasksNumber} tasks`
      : `Welcome back ${userName}, you have ${tasksNumber} tasks`;
  
    return (
      <div className=" fixed inset-30 text-center mt-8">
        <h4 className="text-3xl font-bold">{greeting}</h4>
      </div>
    );
  }
  
  export default WelcomeMessage;
  

