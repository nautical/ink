const hireapply = require('./apply.model');
const settings = require('../settings/settings.model');
const logs = require('../logs/logs.model');
const sources = require('../sources/sources.model');
const application = require('../application/application.model');
const aqp = require('api-query-params');

function putApply(req, res, next) {
  hireapply.findById(req.body.id)
    .then((hireObj) => {
      if (!hireObj) res.json({ status: 'failed' });
      else {
        if (req.body.meta) {
          hireObj.meta = req.body.meta;
          hireObj.markModified(hireObj.meta);
        }
        if (req.body.status) {
          hireObj.status = req.body.status;
          hireObj.markModified(hireObj.status);
        }
        if (req.body.notes) {
          hireObj.notes = req.body.notes;
          hireObj.markModified(hireObj.notes);
        }
        if (req.body.rating) {
          hireObj.rating = req.body.rating;
          hireObj.markModified(hireObj.rating);
        }
        hireObj.save().then((err) => {
          if (err) console.log(err);
          res.json({ status: 'success' });
        });
      }
    }).catch(e => next(e));
}

function getApply(req, res, next) {
  const { filter, skip, limit, sort, projection } = aqp(req.query);

  sources.find({
    owner: req.user.id
  }).then((links) => {
    // find links that belong to the owner
    const linkObj = {};
    links.forEach((o) => {
      linkObj[o.link] = o.desc;
    });
    // find all applies to those links
    
    console.log(filter)

    hireapply
    .find({
      link: {
        $in: links.map(o => o.link)
      }
    })
    .find(filter)
    .skip(skip || 0)
    .limit(limit || 0)
    .sort(sort)
    .select(projection)
    .then((hireObj) => {
      res.json({
        total: hireObj.length,
        items: hireObj.map(o => ({
          id: o._id,
          timestamp: o.createdAt,
          link: linkObj[o.link],
          title: `${o.firstName} ${o.lastName}`,
          rating: o.rating || 1,
          status: o.status || 'applied',
          meta: {
            rating_seo: o.meta.rating_seo || 1,
            rating_grammar: o.meta.rating_grammar || 1,
            rating_spell: o.meta.rating_spell || 1,
            rating_ease_of_read: o.meta.rating_ease_of_read || 1,
            rating_time_to_write: o.meta.rating_time_to_write || 1
          },
          questions: o.questions,
          answers: o.answers,
          notes: o.notes
        }))
      });
    }).catch(e => next(e));
  });
}

function postApply(req, res, next) {
  console.log(req.body.slug);
  settings.findOne({
    companySlug: req.body.slug
  }).then((settingsObj) => {
    const newLog = new logs({
      owner: settingsObj.owner,
      message: 'New application received',
      action: '+'
    });
    newLog.save()
    .then((savedLog) => {
      sources.findOne({
        owner: settingsObj.owner,
        link: req.body.link
      }).then((source) => {
        const newApplication = new application({
          owner: settingsObj.owner,
          source: source._id
        });
        newApplication.save();

        const newApply = new hireapply({
          emailAddress: req.body.emailAddress,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          answers: req.body.answers,
          questions: req.body.questions,
          slug: req.body.slug,
          link: req.body.link
        });
        newApply.save()
          .then(savedApply => res.json({
            status: 'success'
          }))
          .catch(e => next(e));
      }).catch(e => next(e));
    })
    .catch(e => next(e));
  }).catch(e => next(e));
}

module.exports = { getApply, postApply, putApply };
