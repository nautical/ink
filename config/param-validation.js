const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  signup: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().regex(/\S+@\S+\.\S+/).required(),
    }
  },

  sourcesCreate: {
    body: {
      desc: Joi.string().required()
    }
  },

  sourcesEdit: {
    body: {
      link: Joi.string().required(),
      desc: Joi.string().required()
    }
  },

  sourcesDelete: {
    body: {
      link: Joi.string().required()
    }
  },

  applicationLog: {
    body: {
      owner: Joi.string().required(),
      source: Joi.string().required()
    }
  },

  postLogValidate: {
    body: {
      owner: Joi.string().required(),
      message: Joi.string().required(),
      action: Joi.string().required(),
      meta: Joi.object()
    }
  },

  postQAs: {
    body: {
      source: Joi.string().required(),
      qa: Joi.array().required()
    }
  },

  getQAs: {
    body: {
      source: Joi.string().required()
    }
  },

  postSettings: {
    body: {
      companySlug: Joi.string().required(),
      companyName: Joi.string().allow('').required(),
      companyWebsite: Joi.string().allow('').required(),
      companyAddress: Joi.string().allow('').required(),
      companyTeam: Joi.array().allow([]).required(),
      notifications: Joi.string().allow('').required(),
      language: Joi.string().allow('').required()
    }
  },

  postSearchSettings: {
    body: {
      companySlug: Joi.string().required()
    }
  },

  getPublicQAs: {
    body: {
      companySlug: Joi.string().required(),
      link: Joi.string().required()
    }
  },

  postApply: {
    body: {
      emailAddress: Joi.string().regex(/\S+@\S+\.\S+/).required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      answers: Joi.array().required(),
      questions: Joi.array().required(),
      slug: Joi.string().required(),
      link: Joi.string().required(),
    }
  },

  putApply: {
    body: {
      id: Joi.string().required(),
      meta: Joi.object(),
      status: Joi.string(),
      notes: Joi.string(),
      rating: Joi.number()
    }
  }
};
