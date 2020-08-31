const express = require('express');
const { Op } = require('sequelize');
const { isAuthenticated } = require('./isAuth');
const { models } = require('../models');

const router = express.Router();

router.get('/all', isAuthenticated, async (req, res) => {
  const allUsers = await models.User.findAll({
    where: {
      id: {
        [Op.ne]: req.userId,
      },
    },
    attributes: ['id', 'name']
  });
  res.send(allUsers);
});

module.exports = router;