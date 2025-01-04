import { useState, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, File, Upload } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  shipmentId: z.string().transform(Number),
  type: z.string().min(1, "Document type is required"),
  filename: z.string().min(1, "Filename is required"),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 5MB"),
});

type FormData = z.infer<typeof formSchema>;

export function DocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shipmentId: "",
      type: "",
      filename: "",
    },
  });

  const { data: documents, isLoading } = useQuery({
    queryKey: ["/api/admin/documents"],
  });

  const { data: shipments } = useQuery({
    queryKey: ["/api/admin/shipments"],
  });

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const fileContent = await convertFileToBase64(data.file);
      const documentData = {
        shipmentId: data.shipmentId,
        type: data.type,
        filename: data.filename,
        fileContent: fileContent,
        fileSize: data.file.size,
        mimeType: data.file.type,
      };

      const response = await fetch("/api/admin/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(documentData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
      setIsCreateOpen(false);
      form.reset();
      toast({
        title: "Document created",
        description: "The document has been uploaded successfully.",
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
      const fileContent = await convertFileToBase64(data.file);
      const documentData = {
        shipmentId: data.shipmentId,
        type: data.type,
        filename: data.filename,
        fileContent: fileContent,
        fileSize: data.file.size,
        mimeType: data.file.type,
      };

      const response = await fetch(`/api/admin/documents/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(documentData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
      setIsEditOpen(false);
      setSelectedDocument(null);
      form.reset();
      toast({
        title: "Document updated",
        description: "The document has been updated successfully.",
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
      const response = await fetch(`/api/admin/documents/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
      setIsDeleteOpen(false);
      setSelectedDocument(null);
      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully.",
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

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("filename", file.name);
      form.setValue("file", file);
    }
  }, [form]);

  function onCreateSubmit(data: FormData) {
    createMutation.mutate(data);
  }

  function onEditSubmit(data: FormData) {
    if (!selectedDocument) return;
    updateMutation.mutate({ ...data, id: selectedDocument.id });
  }

  function handleEdit(document: any) {
    setSelectedDocument(document);
    form.reset({
      shipmentId: document.shipmentId.toString(),
      type: document.type,
      filename: document.filename,
    });
    setIsEditOpen(true);
  }

  function handleDelete(document: any) {
    setSelectedDocument(document);
    setIsDeleteOpen(true);
  }

  function downloadDocument(document: any) {
    const link = document.createElement('a');
    link.href = document.fileContent;
    link.download = document.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const documentTypes = [
    "invoice",
    "bill_of_lading",
    "customs_declaration",
    "packing_list",
    "certificate_of_origin",
    "insurance_certificate",
  ];

  return (
    <AdminPageLayout title="Documents Management">
      <div className="mb-4 flex justify-end">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
              <DialogDescription>
                Upload a new shipping document to the system
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onCreateSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="shipmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipment</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a shipment" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {shipments?.map((shipment: any) => (
                            <SelectItem
                              key={shipment.id}
                              value={shipment.id.toString()}
                            >
                              {shipment.trackingNumber}
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                            >
                              {type.split("_").map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(" ")}
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
                  name="file"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Document File</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                            onChange={onFileChange}
                            {...field}
                          />
                          <Upload className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Upload Document</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Filename</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : documents?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No documents found
                </TableCell>
              </TableRow>
            ) : (
              documents?.map((document: any) => (
                <TableRow key={document.id}>
                  <TableCell>{document.shipment?.trackingNumber || document.shipmentId}</TableCell>
                  <TableCell>
                    {document.type.split("_").map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(" ")}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => downloadDocument(document)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <File className="h-4 w-4" />
                      {document.filename}
                    </button>
                  </TableCell>
                  <TableCell>
                    {new Date(document.uploadedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(document)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(document)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Modify document information
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="shipmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipment</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a shipment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shipments?.map((shipment: any) => (
                          <SelectItem
                            key={shipment.id}
                            value={shipment.id.toString()}
                          >
                            {shipment.trackingNumber}
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {documentTypes.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                          >
                            {type.split("_").map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(" ")}
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
                name="file"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Document File</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                          onChange={onFileChange}
                          {...field}
                        />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Document</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedDocument?.filename}? This action cannot be undone.
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
              onClick={() => selectedDocument && deleteMutation.mutate(selectedDocument.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
}