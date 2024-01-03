const mongoose = require('mongoose');
const RunningNumber = require('../models/RunningNumber');
const Request = require('../models/Request');

const generateRunningNumber = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString();

    const lastRunningNumberDoc = await RunningNumber.findOne().sort({
      _id: -1,
    });

    const lastItem = await Request.findOne().sort({ create_at: -1 });

    let runningNumber;
    if (lastRunningNumberDoc) {
      const lastYear = lastItem.nomor_request.split('/')[4];
      const lastRunningNumber = parseInt(
        lastRunningNumberDoc.runningNumber,
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

    const user = res.locals.currentUser;

    await RunningNumber.create({ runningNumber: runningNumber });
    const runningNumberCreated = `PO/HTL/${user.erro}/${month}/${year}/${runningNumber}`;

    await session.commitTransaction();
    session.endSession();

    return runningNumberCreated;
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    res
      .json({ error: true, message: 'Gagal membuat running number' });
  }
};

module.exports = generateRunningNumber;
