const multer = require('multer');
const fs = require('fs');
const os = require('os');

const homePath = os.homedir();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { fieldname } = file;
    if (fieldname == 'stnk') {
      const uploadFolder = `${homePath}/mini-ho-file/stnk`;
      if (!fs.existsSync(uploadFolder)) {
        // Jika belum ada, buat folder
        fs.mkdirSync(uploadFolder, { recursive: true });
      }

      cb(null, uploadFolder);
    } else {
      const uploadFolder = `${homePath}/mini-ho-file/ktp`;
      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }
      cb(null, uploadFolder);
    }
  },
  filename: function (req, file, cb) {
    const { nomor } = req.body;
    const { fieldname, originalname } = file;
    cb(null, `${Date.now()}_${nomor}_${fieldname}_${originalname}`);
  },
});

const upload = multer({ storage: storage });

module.exports = {
  upload,
};
