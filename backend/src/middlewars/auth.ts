import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { decode } from "node:punycode";

export interface AuthRequest extends Request {
  userId?: number;
  userRole?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Looks Like you have not logged in yet" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_KEY as string,
    ) as { id: number; role: string };
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.error("Error while verifying : ", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
