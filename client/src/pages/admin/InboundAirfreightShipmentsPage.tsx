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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

const formSchema = z.object({
  shipperId: z.string().min(1, "Shipper is required"),
  consigneeId: z.string().min(1, "Consignee is required"),
  internationalAgentId: z.string().min(1, "International agent is required"),
  airlineId: z.string().min(1, "Airline is required"),
  originAirportId: z.string().min(1, "Origin airport is required"),
  destinationAirportId: z.string().min(1, "Destination airport is required"),
  customsBrokerId: z.string().min(1, "Customs broker is required"),
  truckerId: z.string().min(1, "Trucker is required"),
  hawb: z.string().min(1, "HAWB is required"),
  mawb: z.string().min(1, "MAWB is required"),
  flightNumber: z.string().min(1, "Flight number is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  arrivalDate: z.string().min(1, "Arrival date is required"),
  pieces: z.string().min(1, "Number of pieces is required"),
  weight: z.string().min(1, "Weight is required"),
  volume: z.string().optional(),
  goodsDescription: z.string().min(1, "Goods description is required"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function InboundAirfreightShipmentsPage() {
  const [selectedShipment, setSelectedShipment] = useState<any | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shipperId: "",
      consigneeId: "",
      hawb: "",
      mawb: "",
      flightNumber: "",
      departureDate: "",
      arrivalDate: "",
      pieces: "",
      weight: "",
      volume: "",
      goodsDescription: "",
      notes: "",
      internationalAgentId: "",
      airlineId: "",
      originAirportId: "",
      destinationAirportId: "",
      customsBrokerId: "",
      truckerId: "",
    },
  });

  // Fetch related data
  const { data: internationalAgents } = useQuery({
    queryKey: ["/api/admin/international-agents"],
  });

  const { data: airlines } = useQuery({
    queryKey: ["/api/admin/airlines"],
  });

  const { data: airports } = useQuery({
    queryKey: ["/api/admin/airports"],
  });

  const overseasAirports = airports?.filter((airport: any) => airport.country !== "Brazil") || [];
  const brazilianAirports = airports?.filter((airport: any) => airport.country === "Brazil") || [];

  const { data: customsBrokers } = useQuery({
    queryKey: ["/api/admin/customs-brokers"],
  });

  const { data: truckers } = useQuery({
    queryKey: ["/api/admin/truckers"],
  });

  const { data: shipments, isLoading } = useQuery({
    queryKey: ["/api/admin/airfreight/inbound"],
  });

  const { data: customers } = useQuery({
    queryKey: ["/api/admin/customers"],
  });

  const overseasCustomers = customers?.filter((customer: any) => customer.country !== "Brazil") || [];
  const brazilianCustomers = customers?.filter((customer: any) => customer.country === "Brazil") || [];


  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/admin/airfreight/inbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/airfreight/inbound"] });
      setIsCreateOpen(false);
      form.reset();
      toast({
        title: "Shipment created",
        description: "The inbound airfreight shipment has been created successfully.",
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
      const response = await fetch(`/api/admin/airfreight/inbound/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/airfreight/inbound"] });
      setIsEditOpen(false);
      setSelectedShipment(null);
      form.reset();
      toast({
        title: "Shipment updated",
        description: "The inbound airfreight shipment has been updated successfully.",
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
      const response = await fetch(`/api/admin/airfreight/inbound/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/airfreight/inbound"] });
      setIsDeleteOpen(false);
      setSelectedShipment(null);
      toast({
        title: "Shipment deleted",
        description: "The inbound airfreight shipment has been deleted successfully.",
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
    if (!selectedShipment) return;
    updateMutation.mutate({ ...data, id: selectedShipment.id });
  }

  function handleEdit(shipment: any) {
    setSelectedShipment(shipment);
    form.reset({
      shipperId: shipment.shipperId.toString(),
      consigneeId: shipment.consigneeId.toString(),
      internationalAgentId: shipment.internationalAgentId.toString(),
      airlineId: shipment.airlineId.toString(),
      originAirportId: shipment.originAirportId.toString(),
      destinationAirportId: shipment.destinationAirportId.toString(),
      customsBrokerId: shipment.customsBrokerId.toString(),
      truckerId: shipment.truckerId.toString(),
      hawb: shipment.hawb,
      mawb: shipment.mawb,
      flightNumber: shipment.flightNumber,
      departureDate: new Date(shipment.departureDate).toISOString().split('T')[0],
      arrivalDate: new Date(shipment.arrivalDate).toISOString().split('T')[0],
      pieces: shipment.pieces.toString(),
      weight: shipment.weight,
      volume: shipment.volume || "",
      goodsDescription: shipment.goodsDescription,
      notes: shipment.notes || "",
    });
    setIsEditOpen(true);
  }

  function handleDelete(shipment: any) {
    setSelectedShipment(shipment);
    setIsDeleteOpen(true);
  }

  const renderForm = (onSubmit: (data: FormData) => void, submitLabel: string) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="shipperId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipper (Overseas Customer)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shipper" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {overseasCustomers.map((customer: any) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.commercialName} ({customer.country})
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
            name="consigneeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consignee (Brazilian Customer)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select consignee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brazilianCustomers.map((customer: any) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.commercialName} ({customer.city})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="internationalAgentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>International Agent</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select international agent" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {internationalAgents?.map((agent: any) => (
                      <SelectItem key={agent.id} value={agent.id.toString()}>
                        {agent.commercialName}
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
            name="airlineId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Airline</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select airline" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {airlines?.map((airline: any) => (
                      <SelectItem key={airline.id} value={airline.id.toString()}>
                        {airline.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customsBrokerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customs Broker</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customs broker" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customsBrokers?.map((broker: any) => (
                      <SelectItem key={broker.id} value={broker.id.toString()}>
                        {broker.commercialName}
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
            name="truckerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trucker</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trucker" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {truckers?.map((trucker: any) => (
                      <SelectItem key={trucker.id} value={trucker.id.toString()}>
                        {trucker.commercialName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hawb"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HAWB</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mawb"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MAWB</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="flightNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flight Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="departureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departure Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arrivalDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arrival Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="pieces"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pieces</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (Gross)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="volume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volume</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="goodsDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goods Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </div>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="originAirportId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origin Airport (Overseas)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin airport" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {overseasAirports?.map((airport: any) => (
                      <SelectItem key={airport.id} value={airport.id.toString()}>
                        {airport.name} ({airport.iataCode}) - {airport.country}
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
            name="destinationAirportId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination Airport (Brazil)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination airport" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brazilianAirports?.map((airport: any) => (
                      <SelectItem key={airport.id} value={airport.id.toString()}>
                        {airport.name} ({airport.iataCode}) - {airport.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="submit">{submitLabel}</Button>
        </DialogFooter>
      </form>
    </Form>
  );

  return (
    <AdminPageLayout title="Inbound Airfreight Shipments">
      <div className="mb-4 flex justify-end">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Shipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Inbound Shipment</DialogTitle>
              <DialogDescription>
                Add a new inbound airfreight shipment to the system
              </DialogDescription>
            </DialogHeader>
            {renderForm(onCreateSubmit, "Create Shipment")}
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>HAWB</TableHead>
              <TableHead>Flight</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : shipments?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No shipments found
                </TableCell>
              </TableRow>
            ) : (
              shipments?.map((shipment: any) => (
                <TableRow key={shipment.id}>
                  <TableCell>{shipment.hawb}</TableCell>
                  <TableCell>{shipment.flightNumber}</TableCell>
                  <TableCell>{shipment.originAirport?.iataCode}</TableCell>
                  <TableCell>{shipment.destinationAirport?.iataCode}</TableCell>
                  <TableCell>{shipment.status}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(shipment)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(shipment)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Shipment</DialogTitle>
            <DialogDescription>
              Modify inbound airfreight shipment information
            </DialogDescription>
          </DialogHeader>
          {renderForm(onEditSubmit, "Update Shipment")}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Shipment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete shipment {selectedShipment?.hawb}? This action cannot be undone.
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
              onClick={() => selectedShipment && deleteMutation.mutate(selectedShipment.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
}