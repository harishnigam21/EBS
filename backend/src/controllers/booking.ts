import crypto from "crypto";
import { Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../middlewars/auth";

export const bookTicket = async (req: AuthRequest, res: Response) => {
  const { eventId } = req.body;
  const userId = req.userId;
  if (req.userRole == "ADMIN") {
    return res
      .status(400)
      .json({ message: "Let make User to book ticket them self" });
  }
  if (!eventId) {
    return res.status(400).json({ error: "Event ID are required" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingBooking = await tx.booking.findFirst({
        where: {
          userId: Number(userId),
          eventId: Number(eventId),
        },
      });

      if (existingBooking) {
        throw new Error("Exist");
      }
      // Find the event and lock the row for the transaction
      const event = await tx.event.findUnique({
        where: { id: Number(eventId) },
      });
      if (!event) {
        throw new Error("not found");
      }
      if (event.remaining_tickets <= 0) {
        throw new Error("Sold out");
      }

      // Update remaining_tickets in a transaction, this will avoid race condition
      await tx.event.update({
        where: { id: Number(eventId) },
        data: { remaining_tickets: { decrement: 1 } },
      });

      // Provide a unique code post booking randombytes will more efficient then uuid
      const bookingCode = crypto.randomBytes(4).toString("hex").toUpperCase();

      return await tx.booking.create({
        data: {
          userId: Number(userId),
          eventId: Number(eventId),
          bookingCode: String(bookingCode),
        },
      });
    });

    res.status(201).json({
      message: "Booked!",
      code: result.bookingCode,
    });
  } catch (error: any) {
    console.error("Error from bookTicker Controller : ", error);
    if (error.message === "Exist") {
      return res
        .status(409)
        .json({ message: "You have already booked a ticket for this event." });
    }
    if (error.message === "not found") {
      return res.status(404).json({ message: "Event does not exist" });
    }
    if (error.message === "Sold out") {
      return res.status(400).json({ message: "All tickets are sold out" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    const paramsID = parseInt(req.params.id as string);
    if (req.userRole == "ADMIN" && !paramsID) {
      return res.status(400).json("Admin requires user ID at params");
    }
    const id = req.userRole == "ADMIN" ? paramsID : req.userId;
    const userId = Number(id);
    const bookings = await prisma.booking.findMany({
      where: { userId },
      select: {
        id: true,
        bookingCode: true,
        bookingDate: true,
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
          },
        },
      },
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error from getUserBookings Controller : ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markAttendance = async (req: AuthRequest, res: Response) => {
  const paramsID = parseInt(req.params.id as string);
   if (req.userRole == "ADMIN" && !paramsID) {
      return res.status(400).json("Admin requires user ID at params");
    }
  const id = req.userRole == "ADMIN" ? paramsID : req.userId;
  const userId = Number(id);
  const { bookingCode } = req.body;

  if (!bookingCode) {
    return res.status(400).json({ message: "Booking code is required" });
  }

  try {
    //transaction to handle race condition when some other request need the same data, that is in process of this transaction.
    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findFirst({
        where: {
          userId: Number(userId),
          bookingCode: String(bookingCode),
        },
      });

      if (!booking) {
        throw new Error("NOT_FOUND");
      }

      const alreadyCheckedIn = await tx.eventAttendance.findFirst({
        where: {
          userId: Number(userId),
          eventId: booking.eventId,
        },
      });

      if (alreadyCheckedIn) {
        throw new Error("ALREADY_CHECKED_IN");
      }

      await tx.eventAttendance.create({
        data: {
          userId: Number(userId),
          eventId: booking.eventId,
        },
      });

      const count = await tx.booking.count({
        where: { bookingCode: String(bookingCode) },
      });

      return count;
    });

    res.json({
      message: "Attendance marked successfully",
      ticketsBooked: result,
    });
  } catch (error: any) {
    console.error("Error from markAttendance Controller : ", error);
    if (error.message === "NOT_FOUND") {
      return res
        .status(404)
        .json({ message: "Invalid code or event booking not found" });
    }
    if (error.message === "ALREADY_CHECKED_IN") {
      return res
        .status(400)
        .json({ message: "User has already checked in for this event" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
