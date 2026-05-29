"use client";

import { useEffect, useState } from "react";
import { getEventsWithParticipants } from "@/actions/admin/participants.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Loader2,
  Download,
  User as UserIcon,
  Calendar,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Badge } from "@/components/ui/badge";

interface Participant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  year: string;
  department: string;
  profilePhoto: string;
}

interface Event {
  _id: string;
  eventName: string;
  eventCategory: string;
  participants: Participant[];
}

export default function ParticipantsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await getEventsWithParticipants();
      if (result.success) {
        setEvents(result.events || []);
        setFilteredEvents(result.events || []);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const filtered = events.filter((event) =>
      event.eventName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  const downloadExcel = (event: Event) => {
    const data = event.participants.map((p) => ({
      "Event Name": event.eventName,
      Name: p.name,
      Email: p.email,
      Phone: p.phone,
      "Roll Number": p.rollNumber,
      Year: p.year,
      Department: p.department,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
    XLSX.writeFile(workbook, `${event.eventName}_Participants.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Event Participants
        </h1>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events..."
            className="pl-10 bg-gray-900/50 border-gray-700 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredEvents.map((event) => (
          <Card
            key={event._id}
            className="bg-gray-900/80 border-gray-700 overflow-hidden"
          >
            <CardHeader className="border-b border-gray-800 bg-gray-800/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl text-white">
                      {event.eventName}
                    </CardTitle>
                    <Badge
                      variant={
                        event.eventCategory === "technical"
                          ? "default"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {event.eventCategory}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">
                    Total Participants:{" "}
                    <span className="text-red-500 font-bold">
                      {event.participants.length}
                    </span>
                  </p>
                </div>
                <Button
                  onClick={() => downloadExcel(event)}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                  disabled={event.participants.length === 0}
                >
                  <Download className="h-4 w-4" />
                  Download Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {event.participants.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                  <UserIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No participants registered for this event yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 p-4">
                  {[...event.participants].reverse().map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/40 border border-gray-700/50 hover:bg-gray-800/60 transition-all w-full"
                    >
                      <Avatar className="h-12 w-12 border-2 border-red-500/20">
                        <AvatarImage src={p.profilePhoto} alt={p.name} />
                        <AvatarFallback className="bg-red-700 text-white font-bold">
                          {p.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                          <p className="text-white font-semibold truncate text-base">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {p.email}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 mt-1">
                          <span className="text-xs text-gray-500 font-medium">
                            Roll:{" "}
                            <span className="text-gray-300">
                              {p.rollNumber || "N/A"}
                            </span>
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            Phone:{" "}
                            <span className="text-gray-300">
                              {p.phone || "N/A"}
                            </span>
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            Year/Dept:{" "}
                            <span className="text-gray-300">
                              {p.year} {p.department}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {filteredEvents.length === 0 && (
          <div className="text-center py-20 text-gray-500 bg-gray-900/40 rounded-xl border border-dashed border-gray-700">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No events found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
