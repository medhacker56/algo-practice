/**
 * POST /api/auth
 * body: { action: 'register'|'login'|'logout', ... }
 */
const prisma = require("../../lib/prisma");
const bcrypt = require("bcryptjs");
const { signToken } = require("../../lib/auth");
const cookie = require("cookie");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action, email, password, name } = req.body || {};

  if (action === "register") {
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "User already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, name } });
    const token = signToken({ id: user.id, email: user.email });
    res.setHeader("Set-Cookie", cookie.serialize("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" }));
    return res.json({ id: user.id, email: user.email, name: user.name });
  }

  if (action === "login") {
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const token = signToken({ id: user.id, email: user.email });
    res.setHeader("Set-Cookie", cookie.serialize("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" }));
    return res.json({ id: user.id, email: user.email, name: user.name });
  }

  if (action === "logout") {
    res.setHeader("Set-Cookie", cookie.serialize("token", "", { httpOnly: true, path: "/", maxAge: 0 }));
    return res.json({ ok: true });
  }

  return res.status(400).json({ error: "Unknown action" });
}
