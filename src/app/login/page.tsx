"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //Reset error API
    setError("");
    //Reset error FORM
    const newFormErrors: { username?: string; password?: string } = {};

    /// Validation client side
    if (!username.trim()) {
      newFormErrors.username = "Field is required.";
    }
    if (!password.trim()) {
      newFormErrors.password = "Field is required.";
    }
    setFormErrors(newFormErrors);

    // if form validation error, stop process and return an error
    if (Object.keys(newFormErrors).length > 0) {
      return;
    }

    // If form validation success, get the API
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.replace("/dashboard");
        router.refresh();
        console.log(`Login success, redirecting..........`);
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (apiError) {
      console.error("API Login Error:", apiError);
      setError("Failed to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="card shadow-lg p-5 bg-white rounded-lg max-w-sm w-full">
        <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="form-label block text-gray-700 text-lg font-bold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              className={`form-control shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formErrors.username ? "border-red-500" : ""}`}
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setFormErrors((prev) => ({ ...prev, username: undefined }));
              }}
              placeholder="Input username"
            />
            {formErrors.username && (
              <div className="text-red-500 text-xs italic mt-1">
                {formErrors.username}
              </div>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="form-label block text-gray-700 text-lg font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              className={`form-control shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formErrors.password ? "border-red-500" : ""}`}
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFormErrors((prev) => ({ ...prev, password: undefined })); // Hapus error saat input diubah
              }}
              placeholder="Input password"
            />
            {formErrors.password && (
              <div className="text-red-500 text-xs italic mt-1">
                {formErrors.password}
              </div>
            )}
          </div>
          {/* Menampilkan error dari API atau validasi form secara global */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="btn btn-primary text-lg bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
