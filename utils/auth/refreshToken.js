import jwt from "jsonwebtoken";

const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return newAccessToken;
  } catch (err) {
    throw err;
  }
};

export default refreshAccessToken;
