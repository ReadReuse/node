exports.validate = (type, contract) => {
  return async (req, res, next) => {
    try {
      const submitData = req[type];
      await contract.validateAsync(submitData);
      next();
    } catch (err) {
      if (err && err.details && err.details[0] && err.details[0].message) {
        return res.status(400).json({ message: err.details[0].message });
      }
      return err;
    }
  };
};
