import { ObjectId } from 'mongodb';

// Validar el ID asegurando que sea un string de 24 caracteres y un ObjectId
/**
 * Se valida que sea un string de 24 caracteres ya que en ocasiones MongoDB considera válido valores como '123456'
 * Ejemplos de idName: "ID de evento", "ID de organizador", "ID de usuario"
 */
const validateObjectId = (res, id, idName = 'ID') => {
  if (typeof id !== 'string' || id.length !== 24 || !ObjectId.isValid(id)) {
    return res.status(400).json({ message: `El ${idName} es inválido` });
  }
};

export default validateObjectId;
