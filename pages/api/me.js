const prisma = require("../../lib/prisma");
const { verifyToken } = require("../../lib/auth");

export default async function handler(req, res) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: "Invalid token" });

  const user = await prisma.user.findUnique({ where: { id: payload.id }, select: { id: true, email: true, name: true } });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user);
}
