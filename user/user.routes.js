const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { requireAuth } = require('../auth/auth.middleware');
const validate = require('../middleware/validate')
const { z } = require('zod');

const updatedNameSchema = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .trim()
        .min(1, 'Name is required')
        .max(25, 'Max 25 characters'),
});

router.patch('/me', requireAuth, validate(updatedNameSchema), async (req, res) => {
    try {
        const { name } = req.validated;
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { name },
            select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
        });
        return res.json(user);
    } catch (err) {
        console.error('update /me error:', err);
        if (err.code === 'P2025') return res.status(404).json({ message: 'User not found' });
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = { userRouter: router };