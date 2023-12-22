const express = require('express');
const router = express.Router();
const requestController = require('../controllers/Request.controller');
const { upload } = require('../utils/uploader');
const generateRunningNumber = require('../utils/generate-running-number');

router.get('/', requestController.getRequestParts);
router.post(
  '/',
  upload.fields([{ name: 'ktp' }, { name: 'stnk' }]),
  generateRunningNumber,
  requestController.addRequestParts
);
router.get('/generate-report', requestController.generateReport);
router.get('/generate-ax', requestController.generateAX)

module.exports = router;
