import { validationResult } from "express-validator";

const Validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If we have errors
    let error = {};
    errors.array().map((err) => (error[err.param] = err.msg));
    return res.status(422).json({ error }); // Return error
  }
  next(); // No errors!!
};
export default Validate;
