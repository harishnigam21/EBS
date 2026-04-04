import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name too long"),

  email: z.string().trim().toLowerCase().email("Invalid email format"),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password too long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const CreateEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  date: z
    .string()
    .datetime()
    .refine(
      (val) => {
        const selectedDate = new Date(val);
        const now = new Date();
        return selectedDate >= now;
      },
      {
        message: "Event date must be today or in the future",
      },
    ),
  total_capacity: z.number().int().positive(),
});

export const CreateBookingSchema = z.object({
  eventId: z.number().int(),
});

export const AttendanceSchema = z.object({
  bookingCode: z.string().min(1),
});
