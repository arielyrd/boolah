"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CheckCircle, XCircle, MoreHorizontal, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/admin/admin-header";
import { supabase } from "@/lib/supabase";

export default function AdminBookingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Proteksi admin client-side
  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      const { data, error } = await supabase.from("users").select("role").eq("id", user.id).single();
      if (error || !data || data.role !== "admin") {
        router.replace("/dashboard");
        return;
      }
      setLoading(false);
    };
    checkAdmin();
  }, [router]);

  // State booking
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // Fetch bookings from Supabase
  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase
        .from("bookings")
        .select(
          `
          id,
          field_id,
          user_id,
          date,
          start_time,
          status,
          total_price,
          created_at
        `
        )
        .order("date", { ascending: false });
      if (data) setBookings(data);
    };
    if (!loading) fetchBookings();
  }, [loading]);

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const handleConfirmBooking = (booking: any) => {
    setSelectedBooking(booking);
    setIsConfirmDialogOpen(true);
  };

  const handleCancelBooking = (booking: any) => {
    setSelectedBooking(booking);
    setIsCancelDialogOpen(true);
  };

  const confirmBookingAction = async () => {
    if (selectedBooking) {
      await supabase.from("bookings").update({ status: "confirmed" }).eq("id", selectedBooking.id);
      setBookings(bookings.map((booking) => (booking.id === selectedBooking.id ? { ...booking, status: "confirmed" } : booking)));
      setIsConfirmDialogOpen(false);
    }
  };

  const cancelBookingAction = async () => {
    if (selectedBooking) {
      await supabase.from("bookings").update({ status: "cancelled" }).eq("id", selectedBooking.id);
      setBookings(bookings.map((booking) => (booking.id === selectedBooking.id ? { ...booking, status: "cancelled" } : booking)));
      setIsCancelDialogOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Pending
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

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
                <TableHead>Field ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total Price</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>#{booking.id}</TableCell>
                  <TableCell>{booking.field_id}</TableCell>
                  <TableCell>{booking.user_id}</TableCell>
                  <TableCell>{format(new Date(booking.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{booking.start_time}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell className="text-right">${booking.total_price}</TableCell>
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
                  <h4 className="text-sm font-medium text-muted-foreground">Field ID</h4>
                  <p className="font-medium">{selectedBooking.field_id}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {format(new Date(selectedBooking.date), "MMMM dd, yyyy")}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Start Time</h4>
                    <p>{selectedBooking.start_time}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">User ID</h4>
                  <p>{selectedBooking.user_id}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Total Price</h4>
                    <p className="font-medium">${selectedBooking.total_price}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Booked On</h4>
                    <p>{selectedBooking.created_at ? format(new Date(selectedBooking.created_at), "MMM dd, yyyy") : "-"}</p>
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
              <DialogDescription>Are you sure you want to confirm this booking?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-green-500 hover:bg-green-600" onClick={confirmBookingAction}>
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
              <DialogDescription>Are you sure you want to cancel this booking? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                Go Back
              </Button>
              <Button variant="destructive" onClick={cancelBookingAction}>
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
