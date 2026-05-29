"use server";

import { auth } from "@/auth";
import { connectDB } from "@/utils/db/connect";
import { Events } from "@/models/events.model";
import { User } from "@/models/user.model";

export const getEventsWithParticipants = async () => {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await connectDB();
    const events = await Events.find()
      .populate({
        path: "participants",
        select: "name rollNumber credentials.email credentials.phoneNumber year department profilePhoto",
      })
      .sort({ eventName: 1 });

    const plainEvents = events.map((event: any) => ({
      _id: event._id.toString(),
      eventName: event.eventName,
      eventCategory: event.eventCategory,
      participants: event.participants.map((p: any) => ({
        _id: p._id.toString(),
        name: p.name,
        email: p.credentials?.email,
        phone: p.credentials?.phoneNumber,
        rollNumber: p.rollNumber,
        year: p.year,
        department: p.department,
        profilePhoto: p.profilePhoto,
      })),
    }));

    return { success: true, events: plainEvents };
  } catch (error: any) {
    console.error("Error fetching events with participants:", error);
    return { success: false, message: error.message };
  }
};
