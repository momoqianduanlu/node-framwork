const { validationResult } = require('express-validator');

// 统一处理校验错误 https://express-validator.github.io/docs/guides/manually-running/
module.exports = (validators) => {
  return async (req, res, next) => {
    await Promise.all(validators.map(validator => validator.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
}