import axios from 'axios';

const BASE_URL = 'http://localhost';
const AUTH_PORT = process.env.AUTH_PORT;

const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Acceso no autorizado: Token no proporcionado' });
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    const response = await axios({
      method: 'post',
      url: `${BASE_URL}:${AUTH_PORT}/validate-token`,
      data: { accessToken }
    });

    // Si el access token es válido y no expiró
    const { user } = response.data;

    req.user = user;

    next();
  } catch (err) {
    if (err.response?.data?.error === 'TokenExpiredError') {
      // Si el access token expiró
      const refreshToken = req.headers['x-refresh-token'];

      // Si no se proporcionó un refresh token
      if (!refreshToken) {
        return res.status(401).json({
          message:
            'Token expirado. Refresh token requerido. Vuelva a iniciar sesión'
        });
      }

      try {
        const refreshResponse = await axios({
          method: 'post',
          url: `${BASE_URL}:${AUTH_PORT}/refresh`,
          data: { refreshToken }
        });

        // Si se refrescó el token
        const { accessToken: newToken, user } = refreshResponse.data;
        req.user = user;
        console.log('newToken:', newToken);

        res.setHeader('x-new-token', newToken);

        return next();
      } catch (refreshErr) {
        // Si no se pudo refrescar el token
        console.error(refreshErr.message);
        return res
          .status(401)
          .json({ message: 'Token inválido. Vuelva a iniciar sesión' });
      }
    }

    // Si hubo un error al verificar el token no relacionado con que expiró
    console.error(err);
    return res
      .status(403)
      .json({ message: 'Token inválido. Vuelva a iniciar sesión' });
  }
};

export default verifyAccessToken;
