// Define URL atau endpoint auth

const express = require("express");
const { prisma } = require('../prisma/prismaClient')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { requireAuth } = require("./auth.middleware");
require("dotenv").config();

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
  deviceInfo: z.object({
    deviceName: z.string(),
    deviceType: z.string(),
    deviceOs: z.string(),
  }),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(422)
      .json({ message: "Invalid payload", issues: parsed.error.flatten() });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Email/password salah" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Email/password salah" });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

router.get("/me", requireAuth, async (req, res) => {
  const me = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  res.json(me);
});

router.post("/logout", (_req, res) => res.json({ ok: true }));

module.exports = { authRouter: router };
