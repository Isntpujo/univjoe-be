const express = require('express');
const router = express.Router();

const { requireAuth } = require('../auth/auth.middleware');
const validate = require('../middleware/validate');
const { z } = require('zod');

const { updateMyName } = require('./user.controller');

const updatedNameSchema = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .trim()
        .min(1, 'Name is required')
        .max(25, 'Max 25 characters'),
});

router.patch('/me', requireAuth, validate(updatedNameSchema), updateMyName);

module.exports = { userRouter: router };
