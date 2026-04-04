import { Router } from "express";
import * as BookingController from "../controllers/booking";
import { authenticate } from "../middlewars/auth";
import { AttendanceSchema, CreateBookingSchema } from "../validations/schemas";
import * as EventController from "../controllers/event";
import { CreateEventSchema } from "../validations/schemas";
import { validate } from "../middlewars/validate";
const router = Router();
router.get("/events", EventController.getAllEvents);
router.post(
  "/events",
  authenticate,
  validate(CreateEventSchema),
  EventController.createEvent,
);
router.post(
  "/bookings",
  authenticate,
  validate(CreateBookingSchema),
  BookingController.bookTicket,
);
router.get("/users/:id/bookings", authenticate, BookingController.getUserBookings);
router.post(
  "/events/:id/attendance",
  authenticate,
  validate(AttendanceSchema),
  BookingController.markAttendance,
);

export default router;
