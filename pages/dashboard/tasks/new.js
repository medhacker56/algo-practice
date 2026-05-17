import { useState } from "react";
import { useRouter } from "next/router";
import Header from "../../../components/Header";

export default function NewTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, difficulty })
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert("Failed to create task");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container py-6">
        <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
          <a href="/dashboard" className="text-sm text-blue-600">← Back</a>
          <h2 className="text-xl font-semibold mb-4">Create new task</h2>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="block text-sm">Title</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 p-2 border rounded w-full" />
            </div>
            <div>
              <label className="block text-sm">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 p-2 border rounded w-full" />
            </div>
            <div>
              <label className="block text-sm">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="mt-1 p-2 border rounded w-full">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-blue-600 text-white rounded">Create</button>
              <a href="/dashboard" className="px-3 py-2 border rounded">Cancel</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
