const express = require('express');
const router = express.Router();
const requestController = require('../controllers/Request.controller');
const { upload } = require('../utils/uploader');
const { authenticated } = require('../utils/authentication');

router.get('/', authenticated, requestController.getRequestParts);
router.post(
  '/',
  upload.fields([{ name: 'ktp' }, { name: 'stnk' }, { name: 'kuitansi' }]),
  authenticated,
  requestController.addRequestParts
);
router.get('/generate-report', authenticated, requestController.generateReport);
router.get('/generate-ax', authenticated, requestController.generateAX);

module.exports = router;
