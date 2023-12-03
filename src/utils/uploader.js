const multer = require('multer');
const fs = require('fs');
const os = require('os');

const homePath = os.homedir();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { fieldname } = file;
    const { nomor } = req.body;

    if (fieldname == 'stnk') {
      const uploadFolder = `${homePath}/mini-ho-file/stnk/${nomor}`;
      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }

      cb(null, uploadFolder);
    } else {
      const uploadFolder = `${homePath}/mini-ho-file/ktp/${nomor}`;
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
