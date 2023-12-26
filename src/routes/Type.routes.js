const express = require('express');
const router = express.Router();
const typeController = require('../controllers/Type.controller');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), typeController.storeTypes)
router.get('/', typeController.getTypes)
router.delete('/', typeController.deleteTypes)


module.exports = router