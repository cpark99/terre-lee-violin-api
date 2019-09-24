const express = require('express');
// const path = require('path');
// const jsonBodyParser = express.json();
// const jsonParser = express.json();
// const { requireAuth } = require('../middleware/jwt-auth');
const UsersService = require('./users-service');
const usersRouter = express.Router();

usersRouter
  .route('/:user_id')
  // .all(requireAuth)
  .all((req, res, next) => {
    UsersService.getById(req.app.get('db'), req.params.user_id)
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: `user doesn't exist`
          });
        }
        res.user = user; // save the user for the next middleware
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(UsersService.serializeUser(res.user));
  });

module.exports = usersRouter;
