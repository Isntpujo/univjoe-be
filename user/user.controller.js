const { prisma } = require('../prisma/prismaClient');

exports.updateMyName = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const name = req.validate?.name ?? req.body?.name;
        if (typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ message: 'Validation failed: name is required' });
        }

        const where = { id: Number(req.user.id) };

        const updated = await prisma.user.update({
            where,
            data: { name: name.trim() }, // @updatedAt auto update
            select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
        });

        return res.json(updated);
    } catch (err) {
        if (err?.code === 'P2025') {
            return res.status(404).json({ message: 'User not found' });
        }
        return next(err);
    }
}