const express = require('express');
const router = express.Router();
const userController = require('../controllers/User.controller');

router.get('/', userController.getUsers)
router.post('/', userController.addUser)
router.get('/:username', userController.getUserByUsername)
router.delete('/:username', userController.deleteUserByUsername)
module.exports = router