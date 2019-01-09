const express = require('express');
const validate = require('express-validation');
const expressJwt = require('express-jwt');
const paramValidation = require('../../config/param-validation');
const sourcesCtrl = require('./sources.controller');
const config = require('../../config/config');

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/sources - Protected route */
router.route('/')
  .get(
    expressJwt({ secret: config.jwtSecret }),
    sourcesCtrl.Get
  )

  .post(
    validate(paramValidation.sourcesCreate),
    expressJwt({ secret: config.jwtSecret }),
    sourcesCtrl.Create
  )

  .put(
    validate(paramValidation.sourcesEdit),
    expressJwt({ secret: config.jwtSecret }),
    sourcesCtrl.Edit
  )

  .delete(
    validate(paramValidation.sourcesDelete),
    expressJwt({ secret: config.jwtSecret }),
    sourcesCtrl.Delete
  );

module.exports = router;
