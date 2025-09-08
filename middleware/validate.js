const { ZodError } = require('zod');

module.exports = (schema) => (req, res, next) => {
    try {
        req.validated = schema.parse(req.body);
        next();
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: e.errors,
            });
        }
        next(e);
    }
};
