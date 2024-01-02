const express = require('express');
const router = express.Router();
const partController = require('../controllers/Part.controller');

const multer = require('multer');
const { authenticated } = require('../utils/authentication');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  '/',
  authenticated,
  upload.single('file'),
  partController.storeParts
);
router.get('/', authenticated, partController.getParts);
router.delete('/', authenticated, partController.deleteParts);

module.exports = router;
