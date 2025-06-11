"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Pencil, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/admin/admin-header";
import { FieldData } from "@/types/field";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminFieldsPage() {
  const router = useRouter();
  const [fields, setFields] = useState<FieldData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editField, setEditField] = useState<FieldData | null>(null);

  // Auth & role check
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;
      if (!userId) {
        router.replace("/");
        setChecking(false);
        return;
      }
      // Ambil role dari tabel users
      const { data: userRow, error } = await supabase.from("users").select("role").eq("id", userId).single();
      const isAdmin = userRow?.role === "admin";
      if (!isAdmin) {
        router.replace("/");
      }
      setChecking(false);
    };
    checkUser();
  }, [router]);

  // Form state
  const [form, setForm] = useState({
    name: "",
    sport_type: "",
    location: "",
    description: "",
    price_per_hour: "",
    image_url: "",
    // amenities: "",
  });

  // Fetch all fields
  const fetchFields = async () => {
    setLoading(true);
    let { data, error } = await supabase.from("fields").select("*");
    if (error) data = [];
    setFields(data as FieldData[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!checking) fetchFields();
    // eslint-disable-next-line
  }, [checking]);

  // Handle form change
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle add/edit submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      ...form,
      price_per_hour: Number(form.price_per_hour),
      // amenities: form.amenities.split(",").map((a) => a.trim()),
    };
    let result;
    if (editField) {
      // Update
      result = await supabase.from("fields").update(payload).eq("id", editField.id);
      if (result.error) {
        toast.error("Gagal update field: " + result.error.message);
        return;
      }
      toast.success("Field updated!");
    } else {
      // Create
      result = await supabase.from("fields").insert([payload]);
      if (result.error) {
        toast.error("Gagal menambah field: " + result.error.message);
        return;
      }
      toast.success("Field created!");
    }
    setFormOpen(false);
    setEditField(null);
    setForm({
      name: "",
      sport_type: "",
      location: "",
      description: "",
      price_per_hour: "",
      image_url: "",
      // amenities:
    });
    fetchFields();
  };

  // Handle edit
  const handleEdit = (field: FieldData) => {
    setEditField(field);
    setForm({
      name: field.name,
      sport_type: field.sport_type,
      location: field.location,
      description: field.description,
      price_per_hour: String(field.price_per_hour),
      image_url: field.image_url,
      // amenities: field.amenities?.join(", ") || "",
    });
    setFormOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (fieldToDelete) {
      const result = await supabase.from("fields").delete().eq("id", fieldToDelete);
      if (result.error) {
        toast.error("Gagal menghapus field: " + result.error.message);
        return;
      }
      toast.success("Field deleted!");
      setDeleteConfirmOpen(false);
      setFieldToDelete(null);
      fetchFields();
    }
  };

  if (checking) {
    return <div className="container py-12 text-center">Checking access...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Fields</h1>
          <Button
            onClick={() => {
              setEditField(null);
              setFormOpen(true);
            }}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Field
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
                    <Badge variant="outline">{field.sport_type.charAt(0).toUpperCase() + field.sport_type.slice(1)}</Badge>
                  </TableCell>
                  <TableCell>{field.location}</TableCell>
                  <TableCell className="text-right">${field.price_per_hour}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Open menu</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
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
                        <DropdownMenuItem onClick={() => handleEdit(field)} className="flex items-center">
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive flex items-center"
                          onClick={() => {
                            setFieldToDelete(field.id);
                            setDeleteConfirmOpen(true);
                          }}
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
              <DialogDescription>Are you sure you want to delete this field? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Field Dialog */}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editField ? "Edit Field" : "Add Field"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
              <Input name="sport_type" placeholder="Sport Type" value={form.sport_type} onChange={handleChange} required />
              <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
              <Input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
              <Input name="price_per_hour" type="number" placeholder="Price per hour" value={form.price_per_hour} onChange={handleChange} required />
              <Input name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleChange} required />
              {/* <Input name="amenities" placeholder="Amenities (comma separated)" value={form.amenities} onChange={handleChange} /> */}
              <DialogFooter>
                <Button type="submit">{editField ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
