const express = require('express');
const validate = require('express-validation');
const expressJwt = require('express-jwt');
const paramValidation = require('../../config/param-validation');
const settingsCtrl = require('./settings.controller');
const config = require('../../config/config');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /api/settings - Protected route */
router.route('/')
  .get(
    expressJwt({ secret: config.jwtSecret }),
    settingsCtrl.getSettings
  )
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.postSettings),
    settingsCtrl.postSettings
  );

router.route('/search')
  .post(
    validate(paramValidation.postSearchSettings),
    settingsCtrl.postSearchSettings
  );

module.exports = router;
