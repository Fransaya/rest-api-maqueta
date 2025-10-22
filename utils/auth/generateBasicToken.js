// Generar token de Basic Auth, codificando el email y contraseña a base 64

const generateBasicToken = (email, password) => {
  return Buffer.from(`${email}:${password}`).toString('base64');
};

export default generateBasicToken;
