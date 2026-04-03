import { z } from "zod";

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
