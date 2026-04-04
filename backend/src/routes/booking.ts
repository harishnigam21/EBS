import { Router } from "express";
import * as BookingController from "../controllers/booking";
import { authenticate } from "../middlewars/auth";
import { validate } from "../middlewars/validate";
import { AttendanceSchema, CreateBookingSchema } from "../validations/schemas";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(CreateBookingSchema),
  BookingController.bookTicket,
);
router.get("/", authenticate, BookingController.getUserBookings);
router.post(
  "/attendance",
  authenticate,
  validate(AttendanceSchema),
  BookingController.markAttendance,
);
export default router;
