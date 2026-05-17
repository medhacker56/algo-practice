import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import Header from "../../components/Header";

function TaskCard({ task, onToggle, onDelete }) {
  return (
    <div className="p-4 bg-white rounded shadow flex items-start justify-between">
      <div>
        <h3 className={`font-semibold ${task.completed ? "line-through text-gray-400" : ""}`}>{task.title}</h3>
        <div className="text-sm text-gray-600">{task.description}</div>
        {task.difficulty && <div className="mt-1 text-xs text-gray-500">Difficulty: {task.difficulty}</div>}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onToggle(task)} className="px-2 py-1 border rounded text-sm">{task.completed ? "Undo" : "Done"}</button>
        <Link href={`/dashboard/tasks/${task.id}/edit`} className="px-2 py-1 border rounded text-sm">Edit</Link>
        <button onClick={() => onDelete(task)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const resUser = await fetch("/api/me");
    if (!resUser.ok) {
      Router.push("/");
      return;
    }
    const jsonUser = await resUser.json();
    setUser(jsonUser);

    const res = await fetch("/api/tasks");
    if (res.ok) {
      const data = await res.json();
      setTasks(data);
    } else {
      setTasks([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleCompleted(task) {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed })
    });
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)));
  }

  async function deleteTask(task) {
    if (!confirm("Delete this task?")) return;
    await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Practice Tasks</h2>
          <Link href="/dashboard/tasks/new" className="px-3 py-2 bg-blue-600 text-white rounded">New task</Link>
        </div>

        {tasks.length === 0 ? (
          <div className="p-6 bg-white rounded shadow text-gray-600">No tasks yet. Create your first task.</div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={toggleCompleted} onDelete={deleteTask} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
