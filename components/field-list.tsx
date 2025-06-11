"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FieldData } from "@/types/field";
import { supabase } from "@/lib/supabase";

export function FieldList() {
  const searchParams = useSearchParams();
  const [fields, setFields] = useState<FieldData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFields = async () => {
      setLoading(true);
      let { data, error } = await supabase.from("fields").select("*");
      if (error) data = [];
      setFields(data as FieldData[]);
      setLoading(false);
    };
    fetchFields();
  }, []);

  // Filtering (optional, based on search params)
  const filteredFields = fields.filter((field) => {
    const sportType = searchParams.get("sport");
    const searchQuery = searchParams.get("q")?.toLowerCase();
    const minPrice = Number(searchParams.get("minPrice") || 0);
    const maxPrice = Number(searchParams.get("maxPrice") || 1000);

    let match = true;
    if (sportType && field.sport_type !== sportType) match = false;
    if (searchQuery) {
      const q = searchQuery;
      if (!field.name.toLowerCase().includes(q) && !field.location.toLowerCase().includes(q) && !field.description.toLowerCase().includes(q)) {
        match = false;
      }
    }
    if (field.price_per_hour < minPrice || field.price_per_hour > maxPrice) {
      match = false;
    }
    return match;
  });

  if (loading) {
    return <div className="text-center py-12">Loading fields...</div>;
  }

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
            <img src={field.image_url} alt={field.name} className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" />
            <Badge className="absolute top-2 right-2">{field.sport_type.charAt(0).toUpperCase() + field.sport_type.slice(1)}</Badge>
          </div>
          <CardContent className="flex-1 p-4">
            <h3 className="text-lg font-semibold">{field.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{field.location}</p>
            <p className="text-sm line-clamp-2 mb-3">{field.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {field.amenities?.slice(0, 3).map((amenity, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t p-4 flex items-center justify-between">
            <div className="font-semibold">${field.price_per_hour}/hour</div>
            <Button size="sm" asChild>
              <Link href={`/fields/${field.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
