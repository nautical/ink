const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const sources = require('./sources.model');
const user = require('../user/user.model');
const qas = require('../qas/qas.model');
const logs = require('../logs/logs.model');
const crypto = require('crypto');

/**
 * This is a protected route.
 * @param req
 * @param res
 * @returns {*}
 */
function Edit(req, res, next) {
  user.findOne({
    username: req.user.username
  }).then((user) => {
    if (!user) {
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
      return next(err);
    }
    sources.findOneAndUpdate({
      owner: user._id,
      link: req.body.link
    }, {
      desc: req.body.desc
    }).then((sources) => {
      if (sources) {
        res.json({
          status: 'success'
        });
      } else {
        const err = new APIError('Error processing', httpStatus.BAD_REQUEST, true);
        return next(err);
      }
    });
  }).catch(e => next(e));
}

/**
 * This is a protected route.
 * @param req
 * @param res
 * @returns {*}
 */
function Delete(req, res, next) {
  user.findOne({ // get the user
    username: req.user.username
  }).then((user) => {
    if (!user) {
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
      return next(err);
    }

    sources.findOne({ // find the source
      owner: user._id,
      link: req.body.link
    }).then((source) => {
      if (source) {
        sources.deleteOne({ // delete the source
          owner: user._id,
          link: req.body.link
        }).then(() => {
          qas.deleteOne({ // remove the QAs associated with the source
            owner: user._id,
            source: source._id
          }).then(() => {
            const log = new logs({
              owner: user._id,
              message: `Link deleted ${req.body.link}`,
              action: '-'
            });
            log.save();

            res.json({
              status: 'success'
            });
          });
        }).catch(e => next(e));
      } else {
        const err = new APIError('Server error', httpStatus.BAD_REQUEST, true);
        return next(err);
      }
    });
  }).catch(e => next(e));
}

/**
 * This is a protected route.
 * @param req
 * @param res
 * @returns {*}
 */
function Get(req, res, next) {
  user.findOne({
    username: req.user.username
  }).then((user) => {
    if (!user) {
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
      return next(err);
    }
    sources.find({
      owner: user._id
    }).then(sources => res.json(sources));
  }).catch(e => next(e));
}

/**
 * This is a protected route.
 * @param req
 * @param res
 * @returns {*}
 */
function Create(req, res, next) {
  // req.user is assigned by jwt middleware if valid token is provided
  user.findOne({
    username: req.user.username
  }).then((user) => {
    if (!user) {
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
      return next(err);
    }
    const ID = crypto.randomBytes(5).toString('hex');
    const source = new sources({
      owner: user._id,
      link: `${ID}`,
      desc: req.body.desc
    });
    source.save().then((savedSource) => {
      const log = new logs({
        owner: user._id,
        message: `Link added ${ID}`,
        action: '+'
      });
      log.save();

      res.json({
        status: 'success',
        link: savedSource.link,
        desc: savedSource.desc,
        createdAt: savedSource.createdAt
      });
    }).catch((e) => {
      const err = new APIError('Duplicate not allowed', httpStatus.BAD_REQUEST, true);
      return next(err);
    });
  }).catch(e => next(e));
}

module.exports = { Get, Create, Edit, Delete };
