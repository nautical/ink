const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const applyCtrl = require('./apply.controller');
const config = require('../../config/config');
const expressJwt = require('express-jwt');

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/apply/ - Protected route */
router.route('/')
  .get(
    expressJwt({ secret: config.jwtSecret }),
    applyCtrl.getApply
  )
  .put(
    validate(paramValidation.putApply),
    expressJwt({ secret: config.jwtSecret }),
    applyCtrl.putApply
  )
  .post(
    validate(paramValidation.postApply),
    applyCtrl.postApply
  );


module.exports = router;
