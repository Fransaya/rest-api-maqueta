import jwt from "jsonwebtoken";

const validateToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // err.name puede ser 'TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError'
    throw err; // o devolver null / objeto de error según tu diseño
  }
};

export default validateToken;
