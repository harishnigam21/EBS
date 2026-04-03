import { z } from 'zod';

export const CreateEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  date: z.string().datetime(), 
  total_capacity: z.number().int().positive(),
});

export const CreateBookingSchema = z.object({
  eventId: z.number().int(),
});

export const AttendanceSchema = z.object({
  bookingCode: z.string().min(1),
});