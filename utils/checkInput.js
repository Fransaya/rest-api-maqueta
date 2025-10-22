// Validar que el input contenga los datos obligatorios y no incluya datos no permitidos
const checkInput = (res, data, required = [], allowed = []) => {
  const missingData = required.filter(
    (i) => !data.hasOwnProperty(i) || data[i] === null || data[i] === undefined
  );

  if (missingData.length) {
    return res.status(400).json({
      message: `Faltan estos datos: ${missingData.join(', ')}`
    });
  }

  const invalidKeys = Object.keys(data).filter((key) => !allowed.includes(key));

  if (invalidKeys.length) {
    return res.status(400).json({
      message: `Las siguientes claves son inválidas: ${invalidKeys.join(', ')}`
    });
  }
};

export default checkInput;
