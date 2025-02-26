import jwt from "jsonwebtoken";

const JWT_KEY = process.env.JWT_KEY;

export default async (req, res, next) => {
  const jwtToken = req.cookies.token;

  if (!jwtToken) {
    return res.status(401).json({ message: "user not authenticated" });
  }

  jwt.verify(jwtToken, JWT_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "invalid access token" });
    }
    req.user = decoded;
    next();
  });
};
