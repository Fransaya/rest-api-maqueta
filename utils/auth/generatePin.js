// Generar PIN de seguridad de 6 dígitos (entre 100000 y 999999) para inscripción

const generatePin = () => {
  const pin = Math.floor(100000 + Math.random() * 900000);
  return pin;
};

export default generatePin;
