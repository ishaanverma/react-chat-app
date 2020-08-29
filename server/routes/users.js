const express = require('express');
const sequelize = require('../models');
const { User: user } = sequelize.models;

const router = express.router();

router.get('/all', async (req, res) => {
  const allUsers = await user.findAll();
  res.send(allUsers);
});
