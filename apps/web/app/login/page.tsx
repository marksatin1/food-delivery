"use client";

import { fetchApi } from "@/lib/api";
import { useState, SubmitEvent } from "react";
import { useSession } from "@/context/session-context";
import type { User } from "@food-delivery/shared";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const { login } = useSession();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await login(email, password);
      setSuccess(true);

      // must force the refresh to access updated cookie info
      // router.push('/') does not refresh page
      window.location.href = '/';
    } catch (error: any) {
      setSuccess(false);
      if (error.message.includes('already logged in')) {
        setError("You are already logged in");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-600 text-sm">{`Login unsuccessful: ${error}`}</p>}
        {success && <p className="text-green-600 text-sm">Login successful!</p>}
      </form>
    </div>
  );
}
