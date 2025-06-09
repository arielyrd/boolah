"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const sportTypes = [
  { label: "All Sports", value: "all" },
  { label: "Football", value: "football" },
  { label: "Basketball", value: "basketball" },
  { label: "Tennis", value: "tennis" },
  { label: "Baseball", value: "baseball" },
  { label: "Volleyball", value: "volleyball" },
  { label: "Badminton", value: "badminton" },
];

export function FieldSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sportType, setSportType] = useState(searchParams.get("sport") || "all");
  const [priceRange, setPriceRange] = useState([0, 100]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (sportType && sportType !== "all") params.set("sport", sportType);
    
    router.push(`/fields?${params.toString()}`);
  };
  
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");
    
    if (sportType && sportType !== "all") params.set("sport", sportType);
    else params.delete("sport");
    
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    
    router.push(`/fields?${params.toString()}`);
  };
  
  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search fields..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={sportType} onValueChange={setSportType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sport type" />
          </SelectTrigger>
          <SelectContent>
            {sportTypes.map((sport) => (
              <SelectItem key={sport.value} value={sport.value}>
                {sport.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Refine your search with additional filters
              </SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sport-filter">Sport Type</Label>
                <Select value={sportType} onValueChange={setSportType}>
                  <SelectTrigger id="sport-filter">
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {sportTypes.map((sport) => (
                      <SelectItem key={sport.value} value={sport.value}>
                        {sport.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Price per hour ($)</Label>
                  <span className="text-sm">
                    ${priceRange[0]} - ${priceRange[1]}
                  </span>
                </div>
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={200}
                  step={5}
                  onValueChange={setPriceRange}
                />
              </div>
              
              {/* Add more filters here as needed */}
            </div>
            <SheetFooter>
              <Button onClick={applyFilters}>Apply Filters</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <Button type="submit">Search</Button>
      </form>
      
      {/* Active filters */}
      {(sportType !== "all" || searchQuery) && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {sportType !== "all" && (
            <div className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {sportTypes.find(s => s.value === sportType)?.label || sportType}
            </div>
          )}
          {searchQuery && (
            <div className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              Search: {searchQuery}
            </div>
          )}
        </div>
      )}
    </div>
  );
}