const isAdmin = (req, res, next) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "User not allowed.",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

export default isAdmin;
