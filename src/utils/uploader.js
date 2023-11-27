const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { fieldname } = file;
    if (fieldname == "stnk") {
      cb(null, "public/uploads/stnk");
    } else {
      cb(null, "public/uploads/ktp");
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
