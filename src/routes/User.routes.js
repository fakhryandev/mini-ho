const express = require('express');
const router = express.Router();
const userController = require('../controllers/User.controller');
const { authenticated } = require('../utils/authentication');

router.get('/', authenticated, userController.getUsers);
router.post('/', authenticated, userController.addUser);
router.get('/:username', authenticated, userController.getUserByUsername);
router.post('/:username', authenticated, userController.editUser);
router.delete('/:username', authenticated, userController.deleteUserByUsername);
module.exports = router;
