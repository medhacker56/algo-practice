const prisma = require("../../../lib/prisma");
const { verifyToken } = require("../../../lib/auth");

export default async function handler(req, res) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: "Invalid token" });

  const userId = payload.id;

  if (req.method === "GET") {
    const tasks = await prisma.task.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    return res.json(tasks);
  }

  if (req.method === "POST") {
    const { title, description, difficulty } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });
    const task = await prisma.task.create({ data: { title, description, difficulty, userId } });
    return res.status(201).json(task);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
