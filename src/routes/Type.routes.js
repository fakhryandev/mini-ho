const express = require('express');
const router = express.Router();
const typeController = require('../controllers/Type.controller');

const multer = require('multer');
const { authenticated } = require('../utils/authentication');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  '/',
  authenticated,
  upload.single('file'),
  typeController.storeTypes
);
router.get('/', authenticated, typeController.getTypes);
router.delete('/', authenticated, typeController.deleteTypes);

module.exports = router;
