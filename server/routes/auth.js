const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { models } = require('../models');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, name, password } = req.body;
  const user = models.User.build({
    email: email,
    name: name,
    password: password
  });
  // console.log(user.toJSON());
  try {
    await user.save();
  } catch(error)  {
    return res.status(400).send(error.errors[0].message);
  }
  return res.send({ "user": user.id });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await models.User.findOne({ where: { email: email }});
  if (!user) return res.status(400).send('User does not exist');

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).send('Wrong password');

  const token = jwt.sign({ user_id: user.id }, process.env.SECRET || 'secret');
  res.cookie('token', token, { httpOnly: true, secure: false });
  res.send({ "userId": user.id, "name": user.name });
});

module.exports = router;