const qas = require('./qas.model');
const user = require('../user/user.model');
const httpStatus = require('http-status');
const logs = require('../logs/logs.model');
const APIError = require('../helpers/APIError');
const sources = require('../sources/sources.model');
const settings = require('../settings/settings.model');

function getPublicQAs(req, res, next) {
  const companySlug = req.body.companySlug;
  const link = req.body.link;

  settings.findOne({
    companySlug
  }).then((company) => {
    if (!company) {
      const err = new APIError('Error processing', httpStatus.BAD_REQUEST, true);
      return next(err);
    }
    sources.findOne({
      owner: company.owner,
      link
    }).then((source) => {
      if (!source) {
        const err = new APIError('Error processing', httpStatus.BAD_REQUEST, true);
        return next(err);
      }
      qas.findOne({
        owner: company.owner,
        source: source._id
      }).then((qas) => {
        res.json(qas ? qas.qa : []);
      });
    });
  }).catch(e => next(e));
}


function getQAs(req, res) {
  user.findOne({
    username: req.user.username
  }).then((user) => {
    qas.findOne({
      owner: user._id,
      source: req.body.source
    })
    .then((data) => {
      res.json(data ? { status: 'success', data } : { status: 'success' });
    })
    .catch(e => next(e));
  })
  .catch(e => next(e));
}

function postQAs(req, res, next) {
  user.findOne({
    username: req.user.username
  }).then((user) => {
    sources
    .findById(req.body.source)
    .then((source) => {
      if (source) {
        qas.findOne({
          owner: user._id,
          source: req.body.source
        }).then((qa) => {
          if (qa) {
            qas.findOneAndUpdate({
              owner: user._id,
              source: req.body.source
            }, {
              qa: req.body.qa,
              $push: { qaHistory: { qa: qa.qa, time: new Date() } }
            })
            .then((savedQA) => {
              const log = new logs({
                owner: user._id,
                message: 'QAs updated',
                action: '+'
              });
              log.save();

              res.json({
                savedQA,
                status: 'success'
              });
            })
            .catch(e => next(e));
          } else {
            const newQA = new qas({
              owner: user._id,
              source: req.body.source,
              qa: req.body.qa
            });
            newQA.save()
              .then((savedQA) => {
                const log = new logs({
                  owner: user._id,
                  message: 'QAs updated',
                  action: '+'
                });
                log.save();

                res.json({
                  savedQA,
                  status: 'success'
                });
              })
              .catch(e => next(e));
          }
        });
      } else {
        const err = new APIError('Error processing', httpStatus.BAD_REQUEST, true);
        return next(err);
      }
    });
  });
}

module.exports = { getQAs, postQAs, getPublicQAs };
