const express = require('express');
const validate = require('express-validation');
const expressJwt = require('express-jwt');
const paramValidation = require('../../config/param-validation');
const authCtrl = require('./application.controller');
const config = require('../../config/config');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /api/application/chart - Protected route */
router.route('/chart')
  .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getChart);

/** GET /api/application/stats - Protected route */
router.route('/stats')
  .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getSourceStats);

/** POST /api/application/log - Protected route */
router.route('/log')
  .post(
    validate(paramValidation.applicationLog),
    authCtrl.postApplicationLog
  );


module.exports = router;
