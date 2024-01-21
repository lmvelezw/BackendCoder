export function checkAccess(allowedRoles) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "No has iniciado sesión" });
    }

    const userRole = req.session.user.role;

    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      return res.status(403).json({ message: "Acceso no permitido" });
    }
  };
}