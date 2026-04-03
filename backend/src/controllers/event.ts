import { Request, Response } from "express";
import { prisma } from "../prisma/client";

//Open API, not protecting them for now, although this kind of API should accessed by only admin
export const getAllEvents = async (req: Request, res: Response) => {
  const events = await prisma.event.findMany({
    where: { date: { gte: new Date() } },
  });
  res.json(events);
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, date, total_capacity } = req.body;
    const eventDate = new Date(date);

    //duplicates
    const duplicateTitle = await prisma.event.findFirst({
      where: { title: title },
    });
    if (duplicateTitle) {
      return res
        .status(400)
        .json({ error: "An event with this title already exists." });
    }

    //collisions
    const collision = await prisma.event.findFirst({
      where: { date: eventDate },
    });
    if (collision) {
      return res.status(400).json({
        error:
          "Scheduling collision: Another event is already scheduled for this time.",
      });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: eventDate,
        total_capacity: Number(total_capacity),
        remaining_tickets: Number(total_capacity),
      },
    });
    res.status(201).json(event);
  } catch (error: any) {
    console.log("Error from createEvent Controller :", error);
    res
      .status(500)
      .json({ error: "Internal server error while creating event." });
  }
};
