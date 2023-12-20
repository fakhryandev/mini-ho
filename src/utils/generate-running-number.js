const Request = require('../models/Request');

const generateRunningNumber = async (req, res, next) => {
  try {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString();

    const lastItem = await Request.findOne().sort({ nomor_request: -1 });

    let runningNumber;
    if (lastItem) {
      const lastYear = lastItem.nomor_request.split('/')[4];
      const lastRunningNumber = parseInt(
        lastItem.nomor_request.split('/').pop(),
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

    req.runningNumber = `PO/HTL/${user.erro}/${month}/${year}/${runningNumber}`;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal membuat running number' });
  }
};

module.exports = generateRunningNumber;
