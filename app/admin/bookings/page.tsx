"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CheckCircle, XCircle, MoreHorizontal, Eye, Calendar } from "lucide-react";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/admin/admin-header";

// Mock data for bookings
const mockBookings = [
  {
    id: 1,
    fieldId: 1,
    fieldName: "Downtown Soccer Field",
    userId: 101,
    userName: "John Smith",
    userEmail: "john@example.com",
    date: new Date(2025, 4, 15), // May 15, 2025
    timeSlot: "09:00 AM - 10:00 AM",
    price: 60,
    status: "pending",
    createdAt: new Date(2025, 4, 10), // May 10, 2025
  },
  {
    id: 2,
    fieldId: 3,
    fieldName: "Sunshine Tennis Center",
    userId: 102,
    userName: "Emily Johnson",
    userEmail: "emily@example.com",
    date: new Date(2025, 4, 16), // May 16, 2025
    timeSlot: "02:00 PM - 03:00 PM",
    price: 35,
    status: "confirmed",
    createdAt: new Date(2025, 4, 9), // May 9, 2025
  },
  {
    id: 3,
    fieldId: 2,
    fieldName: "Elite Basketball Court",
    userId: 103,
    userName: "Michael Brown",
    userEmail: "michael@example.com",
    date: new Date(2025, 4, 14), // May 14, 2025
    timeSlot: "06:00 PM - 07:00 PM",
    price: 45,
    status: "confirmed",
    createdAt: new Date(2025, 4, 8), // May 8, 2025
  },
  {
    id: 4,
    fieldId: 1,
    fieldName: "Downtown Soccer Field",
    userId: 104,
    userName: "Sofia Garcia",
    userEmail: "sofia@example.com",
    date: new Date(2025, 4, 17), // May 17, 2025
    timeSlot: "11:00 AM - 12:00 PM",
    price: 60,
    status: "pending",
    createdAt: new Date(2025, 4, 11), // May 11, 2025
  },
  {
    id: 5,
    fieldId: 4,
    fieldName: "Green Valley Baseball Field",
    userId: 105,
    userName: "David Wilson",
    userEmail: "david@example.com",
    date: new Date(2025, 4, 18), // May 18, 2025
    timeSlot: "04:00 PM - 05:00 PM",
    price: 70,
    status: "cancelled",
    createdAt: new Date(2025, 4, 7), // May 7, 2025
  },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  
  const handleViewDetails = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };
  
  const handleConfirmBooking = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking);
    setIsConfirmDialogOpen(true);
  };
  
  const handleCancelBooking = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking);
    setIsCancelDialogOpen(true);
  };
  
  const confirmBookingAction = () => {
    if (selectedBooking) {
      // In real app, this would call the Laravel API to confirm the booking
      setBookings(bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status: "confirmed" } 
          : booking
      ));
      setIsConfirmDialogOpen(false);
    }
  };
  
  const cancelBookingAction = () => {
    if (selectedBooking) {
      // In real app, this would call the Laravel API to cancel the booking
      setBookings(bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status: "cancelled" } 
          : booking
      ));
      setIsCancelDialogOpen(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex-1 container py-8">
        <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>#{booking.id}</TableCell>
                  <TableCell className="font-medium">{booking.fieldName}</TableCell>
                  <TableCell>{booking.userName}</TableCell>
                  <TableCell>{format(booking.date, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{booking.timeSlot}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell className="text-right">${booking.price}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(booking)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {booking.status === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => handleConfirmBooking(booking)}>
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              Confirm Booking
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCancelBooking(booking)}>
                              <XCircle className="h-4 w-4 mr-2 text-destructive" />
                              Cancel Booking
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Booking Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Booking ID</h4>
                    <p>#{selectedBooking.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <div>{getStatusBadge(selectedBooking.status)}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Field</h4>
                  <p className="font-medium">{selectedBooking.fieldName}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {format(selectedBooking.date, "MMMM dd, yyyy")}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Time</h4>
                    <p>{selectedBooking.timeSlot}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">User</h4>
                  <p>{selectedBooking.userName}</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.userEmail}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Price</h4>
                    <p className="font-medium">${selectedBooking.price}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Booked On</h4>
                    <p>{format(selectedBooking.createdAt, "MMM dd, yyyy")}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="flex gap-2 sm:justify-between">
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Close
              </Button>
              {selectedBooking && selectedBooking.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      handleCancelBooking(selectedBooking);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      handleConfirmBooking(selectedBooking);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Confirm Booking Dialog */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to confirm this booking?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-green-500 hover:bg-green-600"
                onClick={confirmBookingAction}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Cancel Booking Dialog */}
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this booking? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                Go Back
              </Button>
              <Button 
                variant="destructive" 
                onClick={cancelBookingAction}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}