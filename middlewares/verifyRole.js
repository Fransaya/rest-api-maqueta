const verifyRole =
  (...authorizedRoles) =>
  (req, res, next) => {
    const { role } = req.user;

    if (!authorizedRoles.includes(role)) {
      return res.status(403).send({ message: 'Usuario no autorizado' });
    }
    next();
  };

export default verifyRole;
