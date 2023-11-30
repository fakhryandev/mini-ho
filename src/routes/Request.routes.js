const express = require('express');
const router = express.Router();
const requestController = require('../controllers/Request.controller');
const { upload } = require('../utils/uploader');

router.get('/', requestController.getRequestParts);
router.post(
  '/',
  upload.fields([{ name: 'ktp' }, { name: 'stnk' }]),
  requestController.addRequestParts
);
router.get('/generate-report', requestController.generateReport);

module.exports = router;
