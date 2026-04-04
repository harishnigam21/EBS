import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client";
export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const encrypted = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name,
        email,
        password: encrypted,
        role: role || "USER",
      },
    });
    return res.status(201).json({ message: "Successfully Registered" });
  } catch (error) {
    console.error("Error from register controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({ message: "You have not registered yet" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(403).json({ message: "Invalid password" });
    }
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_KEY as string,
      { expiresIn: "1d" },
    );
    return res.status(200).json({
      message: "Successfully verified",
      acTk: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error from login controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
