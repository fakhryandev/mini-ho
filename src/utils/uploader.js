const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { fieldname } = file;
    if (fieldname == 'stnk') {
      const uploadFolder = 'public/uploads/stnk';
      if (!fs.existsSync(uploadFolder)) {
        // Jika belum ada, buat folder
        fs.mkdirSync(uploadFolder, { recursive: true });
      }

      cb(null, uploadFolder);
    } else {
      const uploadFolder = 'public/uploads/ktp';
      if (!fs.existsSync(uploadFolder)) {
        // Jika belum ada, buat folder
        fs.mkdirSync(uploadFolder, { recursive: true });
      }
      cb(null, uploadFolder);
    }
  },
  filename: function (req, file, cb) {
    const { nomor } = req.body;
    const { fieldname, originalname } = file;
    cb(null, `${nomor}_${fieldname}_${originalname}`);
  },
});

const upload = multer({ storage: storage });

module.exports = {
  upload,
};
