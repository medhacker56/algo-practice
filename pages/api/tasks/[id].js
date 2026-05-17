const prisma = require("../../../lib/prisma");
const { verifyToken } = require("../../../lib/auth");

export default async function handler(req, res) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: "Invalid token" });

  const userId = payload.id;
  const { id } = req.query;

  if (req.method === "GET") {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) return res.status(404).json({ error: "Not found" });
    return res.json(task);
  }

  if (req.method === "PUT") {
    const { title, description, difficulty, completed } = req.body;
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.task.update({
      where: { id },
      data: {
        title: title ?? task.title,
        description: description ?? task.description,
        difficulty: difficulty ?? task.difficulty,
        completed: typeof completed === "boolean" ? completed : task.completed
      }
    });
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) return res.status(404).json({ error: "Not found" });
    await prisma.task.delete({ where: { id } });
    return res.json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
