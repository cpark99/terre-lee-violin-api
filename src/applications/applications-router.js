const express = require('express');
const path = require('path');
const jsonBodyParser = express.json();
const ApplicationsService = require('./applications-service');
const applicationsRouter = express.Router();

applicationsRouter.route('/').post(jsonBodyParser, (req, res, next) => {
  const { email, name, phone, message } = req.body;

  for (const field of ['email', 'name', 'phone'])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });

  const newApplication = {
    email,
    name,
    phone,
    message,
    date_created: 'now()'
  };

  ApplicationsService.insertApplication(req.app.get('db'), newApplication)
    .then(application => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${application.id}`))
        .json(ApplicationsService.serializeApplication(application));
    })
    .catch(next);
});

module.exports = applicationsRouter;
