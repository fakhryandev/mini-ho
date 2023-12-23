const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({
      isAdmin: false,
      isActive: true,
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.json({
      error: true,
    });
  }
};

exports.getUserByUsername = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({
      username: username,
      isAdmin: false,
      isActive: true,
    });

    if (!user) {
      return res.json({
        error: true,
        message: 'Username tidak ditemukan',
      });
    }

    return res.json({
      error: false,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.json({
      error: true,
    });
  }
};

exports.deleteUserByUsername = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({
      username: username,
    });

    if (!user) {
      return res.json({
        error: true,
        message: 'Username tidak ditemukan',
      });
    }

    User.updateOne(
      {
        username,
      },
      {
        isActive: false,
      }
    );

    return res.json({
      error: false,
    });
  } catch (error) {
    console.error(error);
    res.json({
      error: true,
    });
  }
};

exports.addUser = async (req, res) => {
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

exports.editUser = async (req, res) => {
  try {
    const { erro, nama, username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = {
      erro,
      name: nama,
      username,
      password: hashedPassword,
    };

    const filter = {
      username,
      isAdmin: false,
      isActive: true,
    };

    const user = await User.find(filter);

    if (!user) {
      res.json({
        error: true,
        message: 'Username tidak ditemukan',
      });
    }

    await User.findOneAndUpdate(filter, updatedUser);

    res.status(200).json({
      error: false,
      message: 'Berhasil update akun',
    });
  } catch (error) {
    res.json({
      error: true,
      message: 'Gagal, membuat akun',
    });
  }
};
