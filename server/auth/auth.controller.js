const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
const user = require('../user/user.model');
const bcrypt = require('bcrypt');

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  user.findOne({
    username: req.body.username
  }).then((userObj) => {
    if (bcrypt.compareSync(req.body.password, userObj.password)) {
      if (userObj.mailVerified) {
        const token = jwt.sign({
          username: userObj.username,
          id: userObj.id,
          roles: userObj.role
        }, config.jwtSecret);
        return res.json({
          jwt: token,
          user: {
            username: userObj.username,
            role: userObj.role,
            avatar: userObj.avatar,
            email: userObj.email,
            token: userObj.token
          }
        });
      }
      const err = new APIError('Please verify email first', httpStatus.UNAUTHORIZED, true);
      return next(err);
    }
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    return next(err);
  });
}

module.exports = { login };
