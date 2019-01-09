const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const application = require('./application.model');
const user = require('../user/user.model');

/**
 * This is a protected route. Will return chart only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getChart(req, res, next) {
  // req.user is assigned by jwt middleware if valid token is provided
  user.findOne({
    username: req.user.username
  }).then((user) => {
    application.aggregate([
      {
        $match: {
          owner: user._id,
          createdAt: {
            $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000)
          }
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$createdAt' },
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      }
    ]).then((data) => {
      res.json(data);
    }).catch(e => next(e));
  }).catch(e => next(e));
}

function getSourceStats(req, res) {
  user.findOne({
    username: req.user.username
  }).then((user) => {
    application.aggregate([
      {
        $match: {
          owner: user._id
        }
      },
      {
        $lookup: {
          from: 'sources',
          localField: 'source',
          foreignField: '_id',
          as: 'source'
        }
      },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      }
    ]).then((data) => {
      res.json(data);
    }).catch(e => next(e));
  });
}

function postApplicationLog(req, res) {
  const newApplication = new application({
    owner: req.body.owner,
    source: req.body.source
  });
  newApplication.save()
    .then(savedApplication => res.json(savedApplication))
    .catch(e => next(e));
}

module.exports = { getChart, postApplicationLog, getSourceStats };
