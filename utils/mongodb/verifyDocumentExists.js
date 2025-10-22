// Verificar que el ID corresponda a un documento existente en la base de datos de MongoDB
/**
 * Ejemplos de documentName: "Evento", "Organizador", "Usuario"
 */

const verifyDocumentExists = async (res, collection, id, documentName) => {
  const document = await collection.findOne({ _id: id });

  if (!document) {
    return res.status(404).json({ message: `${documentName} no encontrado` });
  }

  return document;
};

export default verifyDocumentExists;
