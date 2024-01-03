const mongoose = require('mongoose');
const RunningNumber = require('../models/RunningNumber');

const generateRunningNumber = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString();

    const lastRunningNumberDoc = await RunningNumber.findOne().sort({
      _id: -1,
    });

    let runningNumber;
    if (lastRunningNumberDoc) {
      const lastRunningNumber = parseInt(
        lastRunningNumberDoc.split('/').pop(),
        10
      );

      if (lastYear === year) {
        runningNumber = (lastRunningNumber + 1).toString().padStart(4, '0');
      } else {
        runningNumber = '0001';
      }
    } else {
      runningNumber = '0001';
    }

    await RunningNumber.create({ runningNumber: runningNumber });

    await session.commitTransaction();
    session.endSession();

    const user = res.locals.currentUser;

    req.runningNumber = `PO/HTL/${user.erro}/${month}/${year}/${runningNumber}`;
    next();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ error: 'Gagal membuat running number' });
  }
};

module.exports = generateRunningNumber;
