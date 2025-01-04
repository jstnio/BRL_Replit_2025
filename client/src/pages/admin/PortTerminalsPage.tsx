import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  portId: z.string().min(1, "Port is required"),
  terminalCode: z.string().min(1, "Terminal code is required"),
  operatingHours: z.string().min(1, "Operating hours are required"),
  cargoTypes: z.string().min(1, "Cargo types are required"),
  maxVesselSize: z.string().optional(),
  berthLength: z.string().optional(),
  maxDraft: z.string().optional(),
  storageCapacity: z.string().optional(),
  contactPerson: z.string().min(1, "Contact person is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  notes: z.string().optional(),
  active: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

export function PortTerminalsPage() {
  const [selectedTerminal, setSelectedTerminal] = useState<any | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      portId: "",
      terminalCode: "",
      operatingHours: "",
      cargoTypes: "",
      maxVesselSize: "",
      berthLength: "",
      maxDraft: "",
      storageCapacity: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
      active: true,
    },
  });

  const { data: terminals, isLoading: isLoadingTerminals } = useQuery({
    queryKey: ["/api/admin/port-terminals"],
  });

  const { data: ports, isLoading: isLoadingPorts } = useQuery({
    queryKey: ["/api/admin/ports"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/admin/port-terminals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          portId: parseInt(data.portId),
          cargoTypes: data.cargoTypes.split(',').map(t => t.trim()),
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/port-terminals"] });
      setIsCreateOpen(false);
      form.reset();
      toast({
        title: "Port terminal created",
        description: "The port terminal has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData & { id: number }) => {
      const response = await fetch(`/api/admin/port-terminals/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          portId: parseInt(data.portId),
          cargoTypes: data.cargoTypes.split(',').map(t => t.trim()),
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/port-terminals"] });
      setIsEditOpen(false);
      setSelectedTerminal(null);
      form.reset();
      toast({
        title: "Port terminal updated",
        description: "The port terminal has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/port-terminals/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/port-terminals"] });
      setIsDeleteOpen(false);
      setSelectedTerminal(null);
      toast({
        title: "Port terminal deleted",
        description: "The port terminal has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  function onCreateSubmit(data: FormData) {
    createMutation.mutate(data);
  }

  function onEditSubmit(data: FormData) {
    if (!selectedTerminal) return;
    updateMutation.mutate({ ...data, id: selectedTerminal.id });
  }

  function handleEdit(terminal: any) {
    setSelectedTerminal(terminal);
    form.reset({
      name: terminal.name,
      portId: terminal.portId.toString(),
      terminalCode: terminal.terminalCode,
      operatingHours: terminal.operatingHours,
      cargoTypes: terminal.cargoTypes.join(', '),
      maxVesselSize: terminal.maxVesselSize,
      berthLength: terminal.berthLength,
      maxDraft: terminal.maxDraft,
      storageCapacity: terminal.storageCapacity,
      contactPerson: terminal.contactPerson,
      phone: terminal.phone,
      email: terminal.email,
      address: terminal.address,
      notes: terminal.notes,
      active: terminal.active,
    });
    setIsEditOpen(true);
  }

  function handleDelete(terminal: any) {
    setSelectedTerminal(terminal);
    setIsDeleteOpen(true);
  }

  const renderForm = (onSubmit: (data: FormData) => void, submitLabel: string) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terminal Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="portId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a port" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ports?.map((port: any) => (
                      <SelectItem key={port.id} value={port.id.toString()}>
                        {port.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terminalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terminal Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="operatingHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operating Hours</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cargoTypes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo Types (comma-separated)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Container, Bulk, General" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxVesselSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Vessel Size</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="berthLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Berth Length</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxDraft"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Draft</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="storageCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Storage Capacity</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">{submitLabel}</Button>
        </DialogFooter>
      </form>
    </Form>
  );

  return (
    <AdminPageLayout title="Port Terminals Management">
      <div className="mb-4 flex justify-end">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Port Terminal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Port Terminal</DialogTitle>
              <DialogDescription>
                Add a new port terminal to the system
              </DialogDescription>
            </DialogHeader>
            {renderForm(onCreateSubmit, "Create Port Terminal")}
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Terminal Name</TableHead>
              <TableHead>Port</TableHead>
              <TableHead>Terminal Code</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingTerminals || isLoadingPorts ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : terminals?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No port terminals found
                </TableCell>
              </TableRow>
            ) : (
              terminals?.map((terminal: any) => {
                const port = ports?.find((p: any) => p.id === terminal.portId);
                return (
                  <TableRow key={terminal.id}>
                    <TableCell>{terminal.name}</TableCell>
                    <TableCell>{port?.name}</TableCell>
                    <TableCell>{terminal.terminalCode}</TableCell>
                    <TableCell>{terminal.contactPerson}</TableCell>
                    <TableCell>{terminal.active ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(terminal)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(terminal)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Port Terminal</DialogTitle>
            <DialogDescription>
              Modify port terminal information
            </DialogDescription>
          </DialogHeader>
          {renderForm(onEditSubmit, "Update Port Terminal")}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Port Terminal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedTerminal?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedTerminal && deleteMutation.mutate(selectedTerminal.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
}
