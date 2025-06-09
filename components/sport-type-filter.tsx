"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderRoot as Football, ShoppingBasket as Basketball, Tent as Tennis, Baseline as Baseball, Users } from "lucide-react";

const sportTypes = [
  { name: "Football", icon: Football, slug: "football" },
  { name: "Basketball", icon: Basketball, slug: "basketball" },
  { name: "Tennis", icon: Tennis, slug: "tennis" },
  { name: "Baseball", icon: Baseball, slug: "baseball" },
  { name: "Other", icon: Users, slug: "other" },
];

export function SportTypeFilter() {
  const [hoveredSport, setHoveredSport] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
      {sportTypes.map((sport) => {
        const Icon = sport.icon;
        const isHovered = hoveredSport === sport.name;
        
        return (
          <Link
            key={sport.name}
            href={`/fields?sport=${sport.slug}`}
            className="group flex flex-col items-center"
            onMouseEnter={() => setHoveredSport(sport.name)}
            onMouseLeave={() => setHoveredSport(null)}
          >
            <div className={`
              flex h-16 w-16 items-center justify-center rounded-full 
              transition-all duration-300 
              ${isHovered ? 'bg-primary text-primary-foreground' : 'bg-muted'}
            `}>
              <Icon className="h-8 w-8" />
            </div>
            <span className={`
              mt-2 text-sm font-medium transition-colors duration-300
              ${isHovered ? 'text-primary' : ''}
            `}>
              {sport.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}