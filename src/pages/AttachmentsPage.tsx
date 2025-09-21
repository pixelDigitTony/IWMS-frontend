import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAttachments,
  deleteAttachment,
  downloadAttachment,
  Attachment
} from '@/features/attachments';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, RefreshCw, Upload, FileText, Image, Package, Tag } from 'lucide-react';
import { AttachmentsTable } from '@/features/attachments/components/AttachmentsTable';
import { AttachmentUpload } from '@/features/attachments/components/AttachmentUpload';
import { getCategoryDisplay } from '@/features/attachments/api';

type DialogMode = 'upload' | 'view' | 'edit' | null;

export function AttachmentsPage() {
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const queryClient = useQueryClient();

  // Fetch all attachments
  const { data: allAttachments = [], isLoading } = useQuery({
    queryKey: ['attachments', categoryFilter],
    queryFn: async () => {
      try {
        return await getAttachments(categoryFilter || undefined);
      } catch (error) {
        console.error('Error fetching attachments:', error);
        throw error;
      }
    },
  });

  // Group attachments by category
  const attachmentsByCategory = allAttachments.reduce((acc, attachment) => {
    const category = attachment.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(attachment);
    return acc;
  }, {} as Record<string, Attachment[]>);

  // Calculate statistics
  const stats = {
    total: allAttachments.length,
    grns: allAttachments.filter(a => a.category === 'GRN').length,
    deliveryNotes: allAttachments.filter(a => a.category === 'DELIVERY_NOTE').length,
    invoices: allAttachments.filter(a => a.category === 'INVOICE').length,
    photos: allAttachments.filter(a => a.category === 'PHOTO').length,
    packingLists: allAttachments.filter(a => a.category === 'PACKING_LIST').length,
    shippingLabels: allAttachments.filter(a => a.category === 'SHIPPING_LABEL').length,
    other: allAttachments.filter(a => a.category === 'OTHER').length,
  };

  // Mutations
  const deleteAttachmentMutation = useMutation({
    mutationFn: deleteAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
    },
  });

  // Handlers
  const handleAttachmentEdit = (attachment: Attachment) => {
    setSelectedAttachment(attachment);
    setDialogMode('edit');
  };

  const handleAttachmentDelete = (attachment: Attachment) => {
    if (window.confirm(`Are you sure you want to delete "${attachment.originalName}"?`)) {
      deleteAttachmentMutation.mutate(attachment.id);
    }
  };

  const handleAttachmentView = (attachment: Attachment) => {
    setSelectedAttachment(attachment);
    setDialogMode('view');
  };

  const handleAttachmentDownload = async (attachment: Attachment) => {
    try {
      const blob = await downloadAttachment(attachment.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const handleUploadComplete = (attachment: Attachment) => {
    queryClient.invalidateQueries({ queryKey: ['attachments'] });
    setDialogMode(null);
  };

  const categoryTabs = [
    { key: 'all', label: 'All', icon: FileText, count: stats.total },
    { key: 'GRN', label: 'GRNs', icon: Package, count: stats.grns },
    { key: 'DELIVERY_NOTE', label: 'Delivery Notes', icon: FileText, count: stats.deliveryNotes },
    { key: 'INVOICE', label: 'Invoices', icon: FileText, count: stats.invoices },
    { key: 'PHOTO', label: 'Photos', icon: Image, count: stats.photos },
    { key: 'PACKING_LIST', label: 'Packing Lists', icon: Package, count: stats.packingLists },
    { key: 'SHIPPING_LABEL', label: 'Shipping Labels', icon: Tag, count: stats.shippingLabels },
    { key: 'OTHER', label: 'Other', icon: FileText, count: stats.other },
  ];

  const getCurrentAttachments = () => {
    if (categoryFilter === '') return allAttachments;
    return allAttachments.filter(a => a.category === categoryFilter);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Attachments & Documents</h1>
          <p className="text-gray-600 mt-1">
            Manage and organize your warehouse documents and files
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['attachments'] });
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setDialogMode('upload')}>
            <Plus className="h-4 w-4 mr-2" />
            Upload File
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">GRNs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.grns}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Image className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Photos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.photos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Tag className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Labels</p>
              <p className="text-2xl font-bold text-gray-900">{stats.shippingLabels}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="all" onValueChange={(value) => setCategoryFilter(value === 'all' ? '' : value)}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.key} value={tab.key} className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {tab.count}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <AttachmentsTable
            attachments={getCurrentAttachments()}
            onEdit={handleAttachmentEdit}
            onDelete={handleAttachmentDelete}
            onView={handleAttachmentView}
            onDownload={handleAttachmentDownload}
            loading={isLoading}
          />
        </TabsContent>

        {categoryTabs.slice(1).map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="space-y-6">
            <AttachmentsTable
              attachments={getCurrentAttachments()}
              onEdit={handleAttachmentEdit}
              onDelete={handleAttachmentDelete}
              onView={handleAttachmentView}
              onDownload={handleAttachmentDownload}
              loading={isLoading}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Upload Dialog */}
      <Dialog open={dialogMode === 'upload'} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>

          <AttachmentUpload
            onUploadComplete={handleUploadComplete}
            onCancel={() => setDialogMode(null)}
            entities={[
              { type: 'ORDER', id: 'order1', name: 'SO-2024-001' },
              { type: 'SHIPMENT', id: 'shipment1', name: 'SHP-2024-001' },
              { type: 'RECEIVING', id: 'grn1', name: 'GRN-2024-001' },
            ]}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={dialogMode === 'view'} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Attachment Details</DialogTitle>
          </DialogHeader>

          {selectedAttachment && (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">
                  {getFileTypeIcon(selectedAttachment.fileType)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {selectedAttachment.originalName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedAttachment.filename}
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Size:</span> {getFileSizeDisplay(selectedAttachment.fileSize)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Type:</span> {selectedAttachment.fileType}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Category:</span> {getCategoryDisplay(selectedAttachment.category)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Uploaded:</span> {new Date(selectedAttachment.uploadedAt).toLocaleString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">By:</span> {selectedAttachment.uploadedByName}
                    </p>
                  </div>
                </div>
              </div>

              {selectedAttachment.description && (
                <div>
                  <h4 className="font-medium mb-1">Description</h4>
                  <p className="text-sm text-gray-600">
                    {selectedAttachment.description}
                  </p>
                </div>
              )}

              {selectedAttachment.tags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAttachment.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedAttachment.relatedEntityType && selectedAttachment.relatedEntityId && (
                <div>
                  <h4 className="font-medium mb-1">Related To</h4>
                  <Badge variant="outline">
                    {selectedAttachment.relatedEntityType} - {selectedAttachment.relatedEntityId}
                  </Badge>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleAttachmentDownload(selectedAttachment)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => {
                    setDialogMode('edit');
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
