"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { FieldData } from "@/types/field";

// Mock data - would be fetched from your Laravel API
const mockFields: FieldData[] = [
  {
    id: 1,
    name: "Downtown Soccer Field",
    sportType: "football",
    location: "123 Main St, Downtown",
    description: "Professional soccer field with high-quality turf and floodlights for evening games. Perfect for team practice or friendly matches. The field includes marked lines, goal posts, and corner flags.",
    pricePerHour: 60,
    imageUrl: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    amenities: ["Locker Rooms", "Floodlights", "Parking", "Shower Facilities", "Water Fountains"]
  },
  {
    id: 2,
    name: "Elite Basketball Court",
    sportType: "basketball",
    location: "456 Park Ave, Midtown",
    description: "Indoor basketball court with professional flooring and scoreboards. The court features regulation dimensions, adjustable hoops, and electronic scoreboards. Perfect for practice, games, or tournaments.",
    pricePerHour: 45,
    imageUrl: "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    amenities: ["Locker Rooms", "Air Conditioning", "Seating Area", "Electronic Scoreboard", "Ball Rental"]
  },
  {
    id: 3,
    name: "Sunshine Tennis Center",
    sportType: "tennis",
    location: "789 Oak St, Westside",
    description: "Outdoor tennis courts with professional surfaces and equipment rental available. Our courts feature professional-grade surfaces, proper net tension, and are regularly maintained for optimal play conditions.",
    pricePerHour: 35,
    imageUrl: "https://images.pexels.com/photos/2403303/pexels-photo-2403303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    amenities: ["Equipment Rental", "Coaching Available", "Restrooms", "Pro Shop", "Viewing Area"]
  },
  {
    id: 4,
    name: "Green Valley Baseball Field",
    sportType: "baseball",
    location: "101 Green Valley Rd",
    description: "Regulation baseball field with dugouts and batting cages. Features a well-maintained infield, outfield, and professional backstop. Ideal for team practices, games, or leagues.",
    pricePerHour: 70,
    imageUrl: "https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    amenities: ["Dugouts", "Batting Cages", "Concession Stand", "Bleachers", "Field Lighting"]
  },
  {
    id: 5,
    name: "City Volleyball Courts",
    sportType: "volleyball",
    location: "202 Beach Blvd, Eastside",
    description: "Indoor and outdoor volleyball courts available for recreational and competitive play. Our facilities include regulation-height nets, proper boundary markings, and well-maintained playing surfaces.",
    pricePerHour: 40,
    imageUrl: "https://images.pexels.com/photos/3151954/pexels-photo-3151954.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    amenities: ["Indoor & Outdoor Options", "Net Provided", "Changing Rooms", "Referee Stand", "Ball Rental"]
  },
  {
    id: 6,
    name: "Badminton Center",
    sportType: "badminton",
    location: "303 Maple Dr, Northside",
    description: "Professional badminton courts with proper lighting and flooring. Our courts feature proper line markings, net height, and specialized flooring designed for badminton play.",
    pricePerHour: 30,
    imageUrl: "https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    amenities: ["Equipment Rental", "Air Conditioning", "Pro Shop", "Coaching Services", "Spectator Seating"]
  }
];

// Mock time slots - would be fetched from your Laravel API
const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", 
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", 
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
  "08:00 PM", "09:00 PM"
];

// Randomly mark some time slots as unavailable
const getAvailableTimeSlots = () => {
  return timeSlots.map(slot => ({
    time: slot,
    available: Math.random() > 0.3, // 70% chance of being available
  }));
};

export default function FieldDetailPage() {
  const params = useParams();
  const router = useRouter();
  const fieldId = Number(params.id);
  
  const field = mockFields.find(f => f.id === fieldId);
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState(getAvailableTimeSlots());
  
  // Handle date change - in real app, this would fetch availability from API
  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedTimeSlot(null);
    setAvailableTimeSlots(getAvailableTimeSlots());
  };
  
  const handleBooking = () => {
    if (!date || !selectedTimeSlot) return;
    
    // In real app, this would send booking request to API
    alert(`Booking request submitted for ${field?.name} on ${format(date, 'PPP')} at ${selectedTimeSlot}`);
    
    // Redirect to login if user isn't authenticated
    // In real app, check auth status first
    router.push('/login?redirect=/bookings');
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
      <Link 
        href="/fields" 
        className="flex items-center text-sm mb-6 hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to fields
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg overflow-hidden">
            <img 
              src={field.imageUrl} 
              alt={field.name}
              className="w-full aspect-video object-cover"
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{field.name}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{field.location}</span>
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <Badge>
                {field.sportType.charAt(0).toUpperCase() + field.sportType.slice(1)}
              </Badge>
              <Badge variant="outline">${field.pricePerHour}/hour</Badge>
            </div>
            
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground mb-6">{field.description}</p>
            
            <h2 className="text-xl font-semibold mb-2">Amenities</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
              {field.amenities.map((amenity, i) => (
                <li key={i} className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Book This Field</CardTitle>
              <CardDescription>
                Select a date and time to book this field
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="font-medium">Date</div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
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
                          className={cn(
                            "justify-start",
                            !available && "opacity-50 cursor-not-allowed"
                          )}
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
              <Button 
                className="w-full" 
                disabled={!date || !selectedTimeSlot}
                onClick={handleBooking}
              >
                Book Now - ${field.pricePerHour}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}