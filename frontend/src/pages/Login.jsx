import { useState } from "react";
import API from "../utils/api"; // adjust if needed
import ronaldoImage from "../assets/ronaldo.avif"

export default function Login({ onSwitchPage, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", { username, password });
      onLogin(res.data.token);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Login failed");
      } else {
        setError("Network error");
      }
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex items-start">
      <div className="relative w-1/2 h-full flex flex-col">
        <div className="absolute top-[25%] left-[10%] flex flex-col z-10 tracking-wide text-shadow-md backdrop-blur-xs text-center">
          <h1 className="text-4xl text-white font-bold my-4 italic">
          Use TaskTracker to Stay Consistent!
          </h1>
          <p className="text-xl text-red-500 font-bold my-4">
          “We don’t want to tell our dreams. We want to show them.” - Cristiano Ronaldo
          </p>
        </div>

        <img
          src={ronaldoImage}
          alt="Cover"
          className="object-cover w-full h-full z-0"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </div>

      <div className="w-1/2 h-full bg-white flex flex-col p-20 justify-between items-center">
        <h1 className="w-full max-w-[600px] mx-auto text-xl text-[#060606] font-semibold tracking-wide">
          TaskTracker
        </h1>

        <div className="w-full flex flex-col max-w-[600px]">
          <div className="flex flex-col mb-2">
            <h3 className="text-3xl font-semibold mb-2">Login</h3>
            <p className="text-base mb-2">Welcome Back! Please enter your details</p>
          </div>

          <div className="w-full flex-col py-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

          <div className="w-full flex items-center justify-between">
            <div className="w-full flex items-center">
              <input type="checkbox" className="w-4 h-4 mr-2" />
              <p className="text-sm">Remember Me</p>
            </div>

            <p
              className="text-sm font-medium whitespace-nowrap cursor-pointer underline underline-offset-2"
              onClick={() => onSwitchPage()}
            >
              Forgot Password?
            </p>
          </div>

          <div className="w-full flex flex-col my-4">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full text-white my-2 font-semibold bg-[#060606] rounded-md p-4 text-center flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <button
              onClick={onSwitchPage}
              className="w-full text-[#060606] my-2 font-semibold bg-white border border-2 rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
            >
              Register
            </button>
          </div>

          <div className="w-full flex items-center justify-center relative py-4">
            <div className="w-full h-[1px] bg-black"></div>
            <p className="text-lg text-black/80 bg-[#f5f5f5]"></p>
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <p className="text-sm font-normal text-[#060606]">
            Don't have an account?{" "}
            <span
              className="font-semibold underline underline-offset-2 cursor-pointer"
              onClick={onSwitchPage}
            >
              Sign up for free
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
