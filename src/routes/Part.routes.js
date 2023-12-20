const express = require('express');
const router = express.Router();
const partController = require('../controllers/Part.controller');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), partController.storeParts)
router.get('/', partController.getParts)
router.delete('/', partController.deleteParts)

module.exports = router