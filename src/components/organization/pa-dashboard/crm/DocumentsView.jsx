
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search, FileText, FilePlus, FileUp, Download, Trash, Eye, MoreHorizontal, File, FileSpreadsheet, FileImage, FileArchive, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const documentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  contactId: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  tags: z.string().optional(),
  file: z.any()
    .refine((file) => file?.size, {
      message: "Please select a file",
    })
});

const DocumentsView = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: "Grand Berna Supply Agreement",
      filename: "grand_berna_supply_agreement.pdf",
      type: "pdf",
      category: "Contract",
      contactId: "1",
      contactName: "John Smith",
      company: "Grand Berna Dairies",
      dateUploaded: "2024-04-15T14:30:00",
      size: "1.2 MB",
      tags: "contract, dairy, supply"
    },
    {
      id: 2,
      title: "Coffee Export Price Sheet Q2 2024",
      filename: "coffee_price_sheet_q2_2024.xlsx",
      type: "excel",
      category: "Pricing",
      contactId: "2",
      contactName: "Sarah Johnson",
      company: "KAJON Coffee Limited",
      dateUploaded: "2024-04-10T09:15:00",
      size: "845 KB",
      tags: "pricing, coffee, export"
    },
    {
      id: 3,
      title: "Distribution Agreement with FreshEco",
      filename: "fresheco_distribution_agreement.pdf",
      type: "pdf",
      category: "Contract",
      contactId: "3",
      contactName: "David Brown",
      company: "FreshEco Farms",
      dateUploaded: "2024-03-28T11:20:00",
      size: "1.5 MB",
      tags: "contract, distribution"
    },
    {
      id: 4,
      title: "Coffee Farm Inspection Photos",
      filename: "coffee_farm_inspection.zip",
      type: "archive",
      category: "Media",
      contactId: "2",
      contactName: "Sarah Johnson",
      company: "KAJON Coffee Limited",
      dateUploaded: "2024-03-15T10:30:00",
      size: "15.8 MB",
      tags: "photos, inspection, coffee"
    },
    {
      id: 5,
      title: "Marketing Brochure - Dairy Products",
      filename: "dairy_products_brochure.pdf",
      type: "pdf",
      category: "Marketing",
      contactId: null,
      contactName: null,
      company: null,
      dateUploaded: "2024-02-22T16:45:00",
      size: "3.2 MB",
      tags: "marketing, brochure, dairy"
    }
  ]);

  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [contacts, setContacts] = useState([
    { id: "1", name: "John Smith", company: "Grand Berna Dairies" },
    { id: "2", name: "Sarah Johnson", company: "KAJON Coffee Limited" },
    { id: "3", name: "David Brown", company: "FreshEco Farms" },
    { id: "4", name: "Emily Wilson", company: "Organic Co-op" },
    { id: "5", name: "Michael Lee", company: "Produce Distributors" }
  ]);

  const form = useForm({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: "",
      contactId: "",
      category: "",
      tags: "",
      file: null
    }
  });

  const handleUploadDocument = (values) => {
    const selectedContact = values.contactId ? contacts.find(c => c.id === values.contactId) : null;
    
    const fileObj = values.file && values.file[0];
    const fileType = fileObj ? getFileType(fileObj.name) : 'unknown';
    
    const newDocument = {
      id: documents.length + 1,
      title: values.title,
      filename: fileObj ? fileObj.name : "unnamed_file",
      type: fileType,
      category: values.category,
      contactId: values.contactId || null,
      contactName: selectedContact ? selectedContact.name : null,
      company: selectedContact ? selectedContact.company : null,
      dateUploaded: new Date().toISOString(),
      size: fileObj ? formatFileSize(fileObj.size) : "Unknown",
      tags: values.tags || null
    };
    
    setDocuments([newDocument, ...documents]);
    setOpenUploadDialog(false);
    form.reset();
    
    toast({
      title: "Document uploaded",
      description: `${values.title} has been added to your documents.`,
    });
  };
  
  const handleDeleteDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: "Document deleted",
      description: "The document has been removed.",
    });
  };

  const getFileType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    if (['pdf', 'doc', 'docx'].includes(extension)) return 'pdf';
    if (['xls', 'xlsx', 'csv'].includes(extension)) return 'excel';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
    if (['zip', 'rar', '7z'].includes(extension)) return 'archive';
    return 'other';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'image':
        return <FileImage className="h-5 w-5 text-purple-500" />;
      case 'archive':
        return <FileArchive className="h-5 w-5 text-yellow-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case "Contract":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{category}</Badge>;
      case "Pricing":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{category}</Badge>;
      case "Marketing":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{category}</Badge>;
      case "Media":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{category}</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Documents</CardTitle>
            <Dialog open={openUploadDialog} onOpenChange={setOpenUploadDialog}>
              <DialogTrigger asChild>
                <Button>
                  <FilePlus className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleUploadDocument)}>
                    <DialogHeader>
                      <DialogTitle>Upload Document</DialogTitle>
                      <DialogDescription>
                        Upload and categorize a document to your CRM.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <FormField
                        control={form.control}
                        name="file"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                          <FormItem>
                            <FormLabel>Document File *</FormLabel>
                            <FormControl>
                              <Input
                                {...fieldProps}
                                type="file"
                                onChange={(e) => onChange(e.target.files)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Document Title *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Supply Agreement" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Contract">Contract</SelectItem>
                                <SelectItem value="Pricing">Pricing</SelectItem>
                                <SelectItem value="Invoice">Invoice</SelectItem>
                                <SelectItem value="Proposal">Proposal</SelectItem>
                                <SelectItem value="Marketing">Marketing</SelectItem>
                                <SelectItem value="Media">Media</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contactId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Associated Contact (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a contact" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                {contacts.map((contact) => (
                                  <SelectItem key={contact.id} value={contact.id}>
                                    {contact.name} ({contact.company})
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
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags (Comma-separated)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. contract, dairy, important" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenUploadDialog(false)} type="button">
                        Cancel
                      </Button>
                      <Button type="submit">Upload</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search documents..."
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
            </TabsList>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date Uploaded</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFileIcon(doc.type)}
                        <div>
                          <div className="font-medium">{doc.title}</div>
                          <div className="text-xs text-muted-foreground">{doc.filename}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(doc.category)}</TableCell>
                    <TableCell>
                      {doc.contactName ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback>{getInitials(doc.contactName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm">{doc.contactName}</div>
                            <div className="text-xs text-muted-foreground">{doc.company}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {format(new Date(doc.dateUploaded), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {doc.tags && doc.tags.split(',').map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex gap-2">
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex gap-2">
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex gap-2 text-destructive" onClick={() => handleDeleteDocument(doc.id)}>
                            <Trash className="h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsView;
