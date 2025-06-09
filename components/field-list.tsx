"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FieldData } from "@/types/field";

// Mock data - would be fetched from your Laravel API
const mockFields: FieldData[] = [
  {
    id: 1,
    name: "Downtown Soccer Field",
    sportType: "football",
    location: "123 Main St, Downtown",
    description: "Professional soccer field with high-quality turf and floodlights for evening games.",
    pricePerHour: 60,
    imageUrl: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    amenities: ["Locker Rooms", "Floodlights", "Parking"]
  },
  {
    id: 2,
    name: "Elite Basketball Court",
    sportType: "basketball",
    location: "456 Park Ave, Midtown",
    description: "Indoor basketball court with professional flooring and scoreboards.",
    pricePerHour: 45,
    imageUrl: "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    amenities: ["Locker Rooms", "Air Conditioning", "Seating Area"]
  },
  {
    id: 3,
    name: "Sunshine Tennis Center",
    sportType: "tennis",
    location: "789 Oak St, Westside",
    description: "Outdoor tennis courts with professional surfaces and equipment rental available.",
    pricePerHour: 35,
    imageUrl: "https://images.pexels.com/photos/2403303/pexels-photo-2403303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    amenities: ["Equipment Rental", "Coaching Available", "Restrooms"]
  },
  {
    id: 4,
    name: "Green Valley Baseball Field",
    sportType: "baseball",
    location: "101 Green Valley Rd",
    description: "Regulation baseball field with dugouts and batting cages.",
    pricePerHour: 70,
    imageUrl: "https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    amenities: ["Dugouts", "Batting Cages", "Concession Stand"]
  },
  {
    id: 5,
    name: "City Volleyball Courts",
    sportType: "volleyball",
    location: "202 Beach Blvd, Eastside",
    description: "Indoor and outdoor volleyball courts available for recreational and competitive play.",
    pricePerHour: 40,
    imageUrl: "https://images.pexels.com/photos/3151954/pexels-photo-3151954.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    amenities: ["Indoor & Outdoor Options", "Net Provided", "Changing Rooms"]
  },
  {
    id: 6,
    name: "Badminton Center",
    sportType: "badminton",
    location: "303 Maple Dr, Northside",
    description: "Professional badminton courts with proper lighting and flooring.",
    pricePerHour: 30,
    imageUrl: "https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    amenities: ["Equipment Rental", "Air Conditioning", "Pro Shop"]
  }
];

export function FieldList() {
  const searchParams = useSearchParams();
  const [filteredFields, setFilteredFields] = useState<FieldData[]>(mockFields);
  
  useEffect(() => {
    const sportType = searchParams.get("sport");
    const searchQuery = searchParams.get("q")?.toLowerCase();
    const minPrice = Number(searchParams.get("minPrice") || 0);
    const maxPrice = Number(searchParams.get("maxPrice") || 1000);
    
    let filtered = [...mockFields];
    
    if (sportType) {
      filtered = filtered.filter(field => field.sportType === sportType);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(
        field => 
          field.name.toLowerCase().includes(searchQuery) ||
          field.location.toLowerCase().includes(searchQuery) ||
          field.description.toLowerCase().includes(searchQuery)
      );
    }
    
    if (minPrice || maxPrice) {
      filtered = filtered.filter(
        field => field.pricePerHour >= minPrice && field.pricePerHour <= maxPrice
      );
    }
    
    setFilteredFields(filtered);
  }, [searchParams]);
  
  if (filteredFields.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No fields found</h3>
        <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
        <Button asChild variant="outline">
          <Link href="/fields">Clear all filters</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {filteredFields.map((field) => (
        <Card key={field.id} className="overflow-hidden flex flex-col h-full">
          <div className="aspect-video relative overflow-hidden">
            <img
              src={field.imageUrl}
              alt={field.name}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
            <Badge className="absolute top-2 right-2">
              {field.sportType.charAt(0).toUpperCase() + field.sportType.slice(1)}
            </Badge>
          </div>
          <CardContent className="flex-1 p-4">
            <h3 className="text-lg font-semibold">{field.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{field.location}</p>
            <p className="text-sm line-clamp-2 mb-3">{field.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {field.amenities.slice(0, 3).map((amenity, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t p-4 flex items-center justify-between">
            <div className="font-semibold">${field.pricePerHour}/hour</div>
            <Button size="sm" asChild>
              <Link href={`/fields/${field.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}