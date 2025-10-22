import jwt from 'jsonwebtoken';

// Generamos el Token JWT
const generateToken = (user, secret, expiresIn = '1h') => {
  return jwt.sign(user, secret, { expiresIn });
};

export default generateToken;
