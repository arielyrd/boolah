"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { FieldData } from "@/types/field";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const timeSlots = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"];

// Fungsi untuk menghitung end_time (1 jam setelah start_time)
function getEndTime(startTime: string) {
  const [time, modifier] = startTime.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  hours += 1;
  if (hours === 24) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

// Fungsi untuk mengubah "10:00 AM" menjadi "10:00:00" (format waktu di database)
function toDbTimeFormat(slot: string) {
  const [time, modifier] = slot.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
}

export default function FieldDetailPage() {
  const params = useParams();
  const router = useRouter();
  const fieldId = params.id as string;

  const [field, setField] = useState<FieldData | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch field data
  useEffect(() => {
    const fetchField = async () => {
      const { data, error } = await supabase.from("fields").select("*").eq("id", fieldId).single();
      if (error) {
        setField(null);
      } else {
        setField(data as FieldData);
      }
    };
    fetchField();
  }, [fieldId]);

  // Fetch user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  // Fetch bookings & set available time slots setiap kali tanggal berubah
  useEffect(() => {
    const fetchBookingsAndSetSlots = async () => {
      if (!date) {
        setAvailableTimeSlots(timeSlots.map((slot) => ({ time: slot, available: true })));
        return;
      }
      const { data: bookings } = await supabase.from("bookings").select("start_time").eq("field_id", fieldId).eq("date", format(date, "yyyy-MM-dd")).eq("status", "confirmed");

      const bookedTimes = bookings ? bookings.map((b) => b.start_time) : [];
      setAvailableTimeSlots(
        timeSlots.map((slot) => {
          const dbTime = toDbTimeFormat(slot);
          return {
            time: slot,
            available: !bookedTimes.includes(dbTime),
          };
        })
      );
    };
    fetchBookingsAndSetSlots();
  }, [date, fieldId]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedTimeSlot(null);
    // availableTimeSlots akan otomatis di-update oleh useEffect di atas
  };

  const handleBooking = async () => {
    if (!date || !selectedTimeSlot) return;

    if (!user) {
      router.push("/login?redirect=/fields/" + fieldId);
      return;
    }

    setLoading(true);
    const endTime = getEndTime(selectedTimeSlot);
    const { error } = await supabase.from("bookings").insert([
      {
        field_id: fieldId,
        user_id: user.id,
        date: format(date, "yyyy-MM-dd"),
        start_time: toDbTimeFormat(selectedTimeSlot), // simpan dalam format DB!
        end_time: endTime,
        status: "pending",
        total_price: field?.price_per_hour ?? 0,
      },
    ]);
    setLoading(false);

    if (error) {
      toast.error("Booking gagal: " + error.message);
    } else {
      toast.success(`Booking request submitted for ${field?.name} on ${format(date, "PPP")} at ${selectedTimeSlot}`);
      setSelectedTimeSlot(null);
    }
  };

  if (!field) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Field Not Found</h2>
        <p className="mb-6">Sorry, the field you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/fields">Browse All Fields</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <Link href="/fields" className="flex items-center text-sm mb-6 hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to fields
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg overflow-hidden">
            <img src={field.image_url} alt={field.name} className="w-full aspect-video object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{field.name}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{field.location}</span>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <Badge>{field.sport_type?.charAt(0).toUpperCase() + field.sport_type?.slice(1)}</Badge>
              <Badge variant="outline">${field.price_per_hour}/hour</Badge>
            </div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground mb-6">{field.description}</p>
            {field.amenities && (
              <>
                <h2 className="text-xl font-semibold mb-2">Amenities</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                  {field.amenities.map((amenity: string, i: number) => (
                    <li key={i} className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Book This Field</CardTitle>
              <CardDescription>Select a date and time to book this field</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="font-medium">Date</div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} />
                    </PopoverContent>
                  </Popover>
                </div>
                {date && (
                  <div className="space-y-2">
                    <div className="font-medium">Time Slot</div>
                    <div className="grid grid-cols-2 gap-2">
                      {availableTimeSlots.map(({ time, available }, i) => (
                        <Button
                          key={i}
                          variant={selectedTimeSlot === time ? "default" : "outline"}
                          className={cn("justify-start", !available && "opacity-50 cursor-not-allowed")}
                          disabled={!available}
                          onClick={() => setSelectedTimeSlot(time)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="pt-4">
              <Button className="w-full" disabled={!date || !selectedTimeSlot || loading} onClick={handleBooking}>
                {loading ? "Booking..." : `Book Now - $${field.price_per_hour}`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
