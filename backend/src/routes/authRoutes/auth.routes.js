const express = require('express');
const router = express.Router();
const { authController } = require('../../controller/index.controller');

router.post('/register', (req, res) => authController.signup(req, res));
router.post('/login', (req, res) => authController.login(req, res));

module.exports = router;
