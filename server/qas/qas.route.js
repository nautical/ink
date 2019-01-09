const express = require('express');
const validate = require('express-validation');
const expressJwt = require('express-jwt');
const paramValidation = require('../../config/param-validation');
const qasCtrl = require('./qas.controller');
const config = require('../../config/config');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /api/qas/search/public - Protected route */
router.route('/search/public')
  .post(
    validate(paramValidation.getPublicQAs),
    qasCtrl.getPublicQAs
  );

/** GET /api/qas/search - Protected route */
router.route('/search')
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.getQAs),
    qasCtrl.getQAs
  );

router.route('/')
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.postQAs),
    qasCtrl.postQAs
  );

module.exports = router;
