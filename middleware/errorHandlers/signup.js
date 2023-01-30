/** @format */

function checkRequiredFields(requiredFields) {
  return function (req, res, next) {
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length) {
      return res
        .status(400)
        .send(`Missing fields: ${missingFields.join(', ')}`);
    }
    next();
  };
}

module.exports = checkRequiredFields;
