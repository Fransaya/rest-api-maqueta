const validateString = (res, str) => {
  if (typeof str !== 'string') {
    return res.status(400).json({ message: `${str} debe ser un string` });
  }
};

export default validateString;
