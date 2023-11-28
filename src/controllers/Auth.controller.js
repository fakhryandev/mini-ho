const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.signUp = async (req, res) => {
  try {
    const { erro, nama, username, password } = req.body;

    const existUser = await User.findOne({ username });

    if (existUser) {
      return res.json({
        error: true,
        message: 'Username telah ada',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      erro,
      name: nama,
      username,
      password: hashedPassword,
    });

    await user.save();

    res.status(200).json({
      error: false,
      message: 'Berhasil membuat akun',
    });
  } catch (error) {
    res.json({
      error: true,
      message: 'Gagal, membuat akun',
    });
  }
};
