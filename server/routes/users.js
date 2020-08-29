const express = require('express');
const { models } = require('../models');

const router = express.Router();

router.get('/all', async (req, res) => {
  const allUsers = await models.User.findAll();
  res.send(allUsers);
});

module.exports = router;