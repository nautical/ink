const settings = require('./settings.model');
const user = require('../user/user.model');
const apply = require('../apply/apply.model');
const logs = require('../logs/logs.model');

function getSettings(req, res) {
  user.findOne({
    username: req.user.username
  }).then((user) => {
    settings.findOne({
      owner: user._id
    })
    .then((data) => {
      if (data) res.json(data);
      else res.json({});
    })
    .catch(e => next(e));
  })
  .catch(e => next(e));
}

function postSearchSettings(req, res) {
  settings.findOne({
    companySlug: req.body.companySlug
  }).then((data) => {
    if (data) {
      res.json({
        companySlug: data.companySlug,
        companyName: data.companyName,
        companyWebsite: data.companyWebsite,
        companyAddress: data.companyAddress
      });
    } else {
      res.json({});
    }
  });
}

function postSettings(req, res, next) {
  settings.findOne({
    owner: req.user.id
  }).then((setting) => {
    if (setting) {
      const OLDSLUG = setting.companySlug;
      if (req.body.companySlug) {
        setting.companySlug = req.body.companySlug;
        setting.markModified('companySlug');
      }
      if (req.body.companyName) {
        setting.companyName = req.body.companyName;
        setting.markModified('companyName');
      }
      if (req.body.companyWebsite) {
        setting.companyWebsite = req.body.companyWebsite;
        setting.markModified('companyWebsite');
      }
      if (req.body.companyAddress) {
        setting.companyAddress = req.body.companyAddress;
        setting.markModified('companyAddress');
      }
      if (req.body.companyTeam) {
        setting.companyTeam = req.body.companyTeam;
        setting.markModified('companyTeam');
      }
      if (req.body.notifications) {
        setting.notifications = req.body.notifications;
        setting.markModified('notifications');
      }
      if (req.body.language) {
        setting.language = req.body.language;
        setting.markModified('language');
      }

      setting.save((err, newSetting) => {
        if (err) {
          console.log(err);
          res.json({});
        } else {
          const log = new logs({
            owner: req.user.id,
            message: 'Settings updated',
            action: '+'
          });
          log.save();

          apply.update({
            slug: OLDSLUG
          }, {
            $set: {
              slug: req.body.companySlug
            }
          }).then(() => {
            console.log('Updated');
          });

          res.json(newSetting);
        }
      });
    } else {
      console.log('NO SETTINGS !!!');
      res.json({});
    }
  }).catch(e => next(e));

    // settings.update({
    //   owner: user._id
    // }, {
    //   owner: user._id,
    //   companySlug: req.body.companySlug,
    //   companyName: req.body.companyName,
    //   companyWebsite: req.body.companyWebsite,
    //   companyAddress: req.body.companyAddress,
    //   companyTeam: req.body.companyTeam,
    //   notifications: req.body.notifications,
    //   language: req.body.language
    // }, {
    //   upsert: true,
    //   setDefaultsOnInsert: true
    // })
    // .then((data) => {
    //   if (data) {
    //     const log = new logs({
    //       owner: user._id,
    //       message: `Settings updated`,
    //       action: '+'
    //     })
    //     log.save()
    //     // get all appies to this slug
    //     // change the slug

    //     res.json(data);
    //   }
    //   else res.json({});
    // })
    // .catch(e => next(e));
}

module.exports = { getSettings, postSettings, postSearchSettings };
