const express = require('express');
const userRoutes = require('./server/user/user.route');
const authRoutes = require('./server/auth/auth.route');
const logsRoutes = require('./server/logs/logs.route');
const qasRoutes = require('./server/qas/qas.route');
const settingsRoutes = require('./server/settings/settings.route');
const sourcesRoutes = require('./server/sources/sources.route');
const applicationRoutes = require('./server/application/application.route');
const applyRoutes = require('./server/apply/apply.route');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.json({ status: 'ok' })
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount application routes at /application
router.use('/application', applicationRoutes);

// mount application routes at /apply
router.use('/apply', applyRoutes);

// mount sources routes at /sources
router.use('/sources', sourcesRoutes);

// mount sources routes at /sources
router.use('/log', logsRoutes);

router.use('/qas', qasRoutes);

router.use('/settings', settingsRoutes);

module.exports = router;
