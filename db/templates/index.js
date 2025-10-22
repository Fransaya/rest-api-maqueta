import { connectToDb } from '../config';

// Iniciar el servidor con la base de datos conectada
connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server ejecutándose en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });
