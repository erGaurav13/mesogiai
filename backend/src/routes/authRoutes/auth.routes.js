const express = require('express');
const router = express.Router();
const { authController } = require('../../controller/index.controller');
const { auth } = require('../../middleware/index.middleware');
router.post('/register', (req, res) => authController.signup(req, res));
router.post('/login', (req, res) => authController.login(req, res));

router.get('/me', auth, (req, res) => authController.getProfile(req, res));
router.get('/logout', auth, (req, res) => authController.logout(req, res));


module.exports = router;
