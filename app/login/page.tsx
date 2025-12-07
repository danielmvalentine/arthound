'use client';

import { useState } from "react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const toggleMode = () => setIsLogin(!isLogin);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    const endpoint = isLogin ? "/api/users/login" : "/api/users/register";

    try {
      const res = await fetch("http://localhost:4000" + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error");
        return;
      }

      // Save token to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      window.location.href = "/profile";

    } catch (e) {
      setError("Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {isLogin ? "Login" : "Register"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Username"
          className="w-full border px-4 py-3 rounded-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-4 py-3 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p className="text-center mt-6">
        {isLogin ? "New user?" : "Already registered?"}{" "}
        <button
          onClick={toggleMode}
          className="text-green-600 underline"
        >
          {isLogin ? "Create an account" : "Login"}
        </button>
      </p>
    </div>
  );
}
