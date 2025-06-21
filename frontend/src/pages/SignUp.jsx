import { useState } from "react";
import API from "../utils/api"; // adjust path as needed
import kobeImage from "../assets/kobe.jpeg"

export default function SignUp({ onSwitchPage, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/auth/signup", { username, password });
      // Auto-login after signup by logging in and getting token:
      const loginRes = await API.post("/auth/login", { username, password });
      onLogin(loginRes.data.token);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Signup failed");
      } else {
        setError("Network error");
      }
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex items-start">
      <div className="relative w-1/2 h-full flex flex-col">
        <div className="absolute top-[25%] left-[10%] flex flex-col z-10 tracking-wide text-shadow-md backdrop-blur-xs ">
          <h1 className="text-4xl text-white font-bold my-4 italic text-center">
            Use TaskTracker to Stay Consistent!
          </h1>
          <p className="text-xl font-bold my-4 text-center text-violet-700">
          "We can always kind of be average and do what’s normal. I’m not in this to do what’s normal." - Kobe Bryant
          </p>
        </div>

        <img
          src={kobeImage}
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
            <h3 className="text-3xl font-semibold mb-2">Sign Up</h3>
            <p className="text-base mb-2">Create your free account</p>
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

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

          <div className="w-full flex flex-col my-4">
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full text-white my-2 font-semibold bg-[#060606] rounded-md p-4 text-center flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <button
              onClick={onSwitchPage}
              className="w-full text-[#060606] my-2 font-semibold bg-white border border-2 rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
            >
              Log In
            </button>
          </div>

          <div className="w-full flex items-center justify-center relative py-4">
            <div className="w-full h-[1px] bg-black"></div>
            <p className="text-lg text-black/80 bg-[#f5f5f5]"></p>
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <p className="text-sm font-normal text-[#060606]">
            Already have an account?{" "}
            <span
              className="font-semibold underline underline-offset-2 cursor-pointer"
              onClick={onSwitchPage}
            >
              Log in here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
