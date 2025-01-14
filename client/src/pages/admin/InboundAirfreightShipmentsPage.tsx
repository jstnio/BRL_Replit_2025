import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Pencil, Trash2, Plus, Download } from "lucide-react";

const formSchema = z.object({
  brlReference: z.string().optional(),
  hawb: z.string().min(1, "HAWB is required"),
  mawb: z.string().min(1, "MAWB is required"),
  shipperId: z.string().min(1, "Shipper is required"),
  consigneeId: z.string().min(1, "Consignee is required"),
  internationalAgentId: z.string().min(1, "International agent is required"),
  airlineId: z.string().min(1, "Airline is required"),
  customsBrokerId: z.string().min(1, "Customs broker is required"),
  truckerId: z.string().min(1, "Trucker is required"),
  originAirportId: z.string().min(1, "Origin airport is required"),
  destinationAirportId: z.string().min(1, "Destination airport is required"),
  flightNumber: z.string().min(1, "Flight number is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  arrivalDate: z.string().min(1, "Arrival date is required"),
  pieces: z.string().min(1, "Number of pieces is required"),
  weight: z.string().min(1, "Weight is required"),
  chargeableWeight: z.string().optional(),
  volume: z.string().optional(),
  goodsDescription: z.string().min(1, "Goods description is required"),
  perishableCargo: z.boolean().default(false),
  dangerousCargo: z.boolean().default(false),
  duimp: z.string().optional(),
  cct: z.enum(["Airline", "Pending", "Ready"]).default("Pending"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function generateBRLReference() {
  const year = new Date().getFullYear().toString().slice(-2);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${year}AI-BR${randomNum}`;
}

export function InboundAirfreightShipmentsPage() {
  const [selectedShipment, setSelectedShipment] = useState<any | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedShipperCountry, setSelectedShipperCountry] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brlReference: "",
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
      perishableCargo: false,
      dangerousCargo: false,
      notes: "",
      internationalAgentId: "",
      airlineId: "",
      originAirportId: "",
      destinationAirportId: "",
      customsBrokerId: "",
      truckerId: "",
      chargeableWeight: "",
      duimp: "",
      cct: "Pending",
    },
  });

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

  const { data: documents } = useQuery({
    queryKey: ['/api/admin/documents'],
  });


  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const brlReference = generateBRLReference();
      const response = await fetch("/api/admin/airfreight/inbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, brlReference }),
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
      brlReference: shipment.brlReference,
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
      perishableCargo: shipment.perishableCargo,
      dangerousCargo: shipment.dangerousCargo,
      chargeableWeight: shipment.chargeableWeight || "",
      duimp: shipment.duimp || "",
      cct: shipment.cct || "Pending",
    });
    setIsEditOpen(true);
  }

  function handleDelete(shipment: any) {
    setSelectedShipment(shipment);
    setIsDeleteOpen(true);
  }

  function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  const renderForm = (onSubmit: (data: FormData) => void, submitLabel: string) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="brlReference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BRL Reference</FormLabel>
                <FormControl>
                  <Input {...field} disabled placeholder="Auto-generated on save" />
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="shipperId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipper (Overseas Customer)</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    const selectedShipper = overseasCustomers.find(
                      (customer: any) => customer.id.toString() === value
                    );
                    setSelectedShipperCountry(selectedShipper?.country || null);
                  }}
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

        {/* International Agent and Airline in same line */}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {overseasAirports
                      ?.filter((airport: any) =>
                        !selectedShipperCountry || airport.country === selectedShipperCountry
                      )
                      .map((airport: any) => (
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
                    {brazilianAirports.map((airport: any) => (
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

        {/* Measurement fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
              name="chargeableWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chargeable Weight</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

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

        {/* Customs Broker and Trucker in same line */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duimp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DUIMP</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cct"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CCT</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CCT status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Airline">Airline</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Ready">Ready</SelectItem>
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
            name="perishableCargo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Perishable Cargo</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dangerousCargo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Dangerous Cargo</FormLabel>
                </div>
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
      </form>
    </Form>
  );

  const DocumentSection = ({ shipmentId, brlReference }: { shipmentId: number, brlReference: string }) => (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Shipping Documents</h3>
        <input
          type="file"
          multiple
          onChange={async (e) => {
            if (!e.target.files?.length) return;

            const formData = new FormData();
            for (let i = 0; i < e.target.files.length; i++) {
              const file = e.target.files[i];
              formData.append('files', file);
            }
            formData.append('shipmentId', shipmentId.toString());
            formData.append('brlReference', brlReference);

            try {
              const response = await fetch('/api/admin/documents/upload', {
                method: 'POST',
                body: formData,
                credentials: 'include',
              });

              if (!response.ok) {
                throw new Error(await response.text());
              }

              toast({
                title: "Files uploaded",
                description: "Documents have been uploaded successfully.",
              });

              // Refresh documents list
              queryClient.invalidateQueries({ queryKey: ['/api/admin/documents'] });
            } catch (error: any) {
              toast({
                variant: "destructive",
                title: "Upload failed",
                description: error.message,
              });
            }
          }}
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        />
      </div>

      {/* Document List */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents?.filter((doc: any) => doc.shipmentId === shipmentId).map((doc: any) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.filename}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                <TableCell>{new Date(doc.uploadedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      // Convert base64 to blob and download
                      const blob = new Blob([Buffer.from(doc.fileContent, 'base64')], { type: doc.mimeType });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = doc.filename;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      try {
                        const response = await fetch(`/api/admin/documents/${doc.id}`, {
                          method: 'DELETE',
                          credentials: 'include',
                        });

                        if (!response.ok) {
                          throw new Error(await response.text());
                        }

                        toast({
                          title: "Document deleted",
                          description: "The document has been deleted successfully.",
                        });

                        queryClient.invalidateQueries({ queryKey: ['/api/admin/documents'] });
                      } catch (error: any) {
                        toast({
                          variant: "destructive",
                          title: "Delete failed",
                          description: error.message,
                        });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Inbound Shipment</DialogTitle>
              <DialogDescription>
                Add a new inbound airfreight shipment to the system
              </DialogDescription>
            </DialogHeader>
            {renderForm(onCreateSubmit, "Create Shipment")}
            <DialogFooter>
              <Button type="submit">Create Shipment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>HAWB</TableHead>
              <TableHead>Shipper</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Consignee</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Flight</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : shipments?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No shipments found
                </TableCell>
              </TableRow>
            ) : (
              shipments?.map((shipment: any) => (
                <TableRow key={shipment.id}>
                  <TableCell>{shipment.hawb}</TableCell>
                  <TableCell>
                    {overseasCustomers.find((c: any) => c.id === shipment.shipperId)?.commercialName}
                  </TableCell>
                  <TableCell>
                    {shipment.originAirport.name} ({shipment.originAirport.iataCode})
                  </TableCell>
                  <TableCell>
                    {brazilianCustomers.find((c: any) => c.id === shipment.consigneeId)?.commercialName}
                  </TableCell>
                  <TableCell>
                    {shipment.destinationAirport.name} ({shipment.destinationAirport.iataCode})
                  </TableCell>
                  <TableCell>{shipment.flightNumber}</TableCell>
                  <TableCell>{new Date(shipment.arrivalDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Dialog open={isEditOpen && selectedShipment?.id === shipment.id} onOpenChange={(open) => {
                      setIsEditOpen(open);
                      if (!open) setSelectedShipment(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(shipment)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Inbound Shipment</DialogTitle>
                          <DialogDescription>
                            Update the inbound airfreight shipment details
                          </DialogDescription>
                        </DialogHeader>
                        {renderForm(onEditSubmit, "Update Shipment")}
                        {selectedShipment && (
                          <DocumentSection
                            shipmentId={selectedShipment.id}
                            brlReference={selectedShipment.brlReference}
                          />
                        )}
                        <DialogFooter className="mt-6">
                          <Button type="button" onClick={form.handleSubmit(onEditSubmit)}>
                            Update Shipment
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={isDeleteOpen && selectedShipment?.id === shipment.id} onOpenChange={(open) => {
                      setIsDeleteOpen(open);
                      if (!open) setSelectedShipment(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(shipment)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Shipment</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this shipment? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              if (selectedShipment) {
                                deleteMutation.mutate(selectedShipment.id);
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        {/*DialogContent moved inside the edit Dialog in the table*/}
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        {/*DialogContent moved inside the delete Dialog in the table*/}
      </Dialog>
    </AdminPageLayout>
  );
}