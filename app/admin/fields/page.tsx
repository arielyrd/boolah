"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle, Pencil, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/admin/admin-header";
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
];

export default function AdminFieldsPage() {
  const [fields, setFields] = useState<FieldData[]>(mockFields);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<number | null>(null);
  
  const handleDeleteClick = (id: number) => {
    setFieldToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDelete = () => {
    if (fieldToDelete) {
      // In real app, this would call the Laravel API to delete the field
      setFields(fields.filter(field => field.id !== fieldToDelete));
      setDeleteConfirmOpen(false);
      setFieldToDelete(null);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Fields</h1>
          <Button asChild>
            <Link href="/admin/fields/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Field
            </Link>
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Sport Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Price/Hour</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {field.sportType.charAt(0).toUpperCase() + field.sportType.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{field.location}</TableCell>
                  <TableCell className="text-right">${field.pricePerHour}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Open menu</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/fields/${field.id}`} className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/fields/${field.id}/edit`} className="flex items-center">
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive flex items-center"
                          onClick={() => handleDeleteClick(field.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this field? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}