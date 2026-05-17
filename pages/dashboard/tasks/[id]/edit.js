import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../../../components/Header";

export default function EditTask() {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/tasks/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setTask(d);
        setTitle(d.title);
        setDescription(d.description || "");
        setDifficulty(d.difficulty || "Medium");
      });
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, difficulty })
    });
    if (res.ok) router.push("/dashboard");
    else alert("Failed to update");
  }

  if (!task) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container py-6">
        <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
          <a href="/dashboard" className="text-sm text-blue-600">← Back</a>
          <h2 className="text-xl font-semibold mb-4">Edit task</h2>
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
              <button className="px-3 py-2 bg-blue-600 text-white rounded">Save</button>
              <a href="/dashboard" className="px-3 py-2 border rounded">Cancel</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
