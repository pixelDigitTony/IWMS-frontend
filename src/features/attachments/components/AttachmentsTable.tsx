import React, { useState } from 'react';
import { Attachment } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Download,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  File,
  Image,
  FileText,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import {
  getFileSizeDisplay,
  getFileTypeIcon,
  getCategoryDisplay
} from '../api';

interface AttachmentsTableProps {
  attachments: Attachment[];
  onEdit: (attachment: Attachment) => void;
  onDelete: (attachment: Attachment) => void;
  onView: (attachment: Attachment) => void;
  onDownload: (attachment: Attachment) => void;
  loading?: boolean;
}

export function AttachmentsTable({
  attachments,
  onEdit,
  onDelete,
  onView,
  onDownload,
  loading = false
}: AttachmentsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const filteredAttachments = attachments.filter((attachment) => {
    const matchesSearch =
      attachment.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attachment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attachment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = !categoryFilter || attachment.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: Attachment['category']) => {
    switch (category) {
      case 'GRN': return 'bg-blue-100 text-blue-800';
      case 'DELIVERY_NOTE': return 'bg-green-100 text-green-800';
      case 'INVOICE': return 'bg-red-100 text-red-800';
      case 'PHOTO': return 'bg-purple-100 text-purple-800';
      case 'PACKING_LIST': return 'bg-yellow-100 text-yellow-800';
      case 'SHIPPING_LABEL': return 'bg-orange-100 text-orange-800';
      case 'OTHER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'GRN', label: 'Goods Receipt Notes' },
    { value: 'DELIVERY_NOTE', label: 'Delivery Notes' },
    { value: 'INVOICE', label: 'Invoices' },
    { value: 'PHOTO', label: 'Photos' },
    { value: 'PACKING_LIST', label: 'Packing Lists' },
    { value: 'SHIPPING_LABEL', label: 'Shipping Labels' },
    { value: 'OTHER', label: 'Other' },
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Attachments ({filteredAttachments.length})</CardTitle>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search attachments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredAttachments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || categoryFilter
                ? 'No attachments match your search criteria.'
                : 'No attachments found. Upload your first file to get started.'}
            </div>
          ) : (
            filteredAttachments.map((attachment) => (
              <div
                key={attachment.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-2xl">
                      {getFileTypeIcon(attachment.fileType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {attachment.originalName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {attachment.filename}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <File className="h-4 w-4" />
                          <span>{getFileSizeDisplay(attachment.fileSize)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(attachment.uploadedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{attachment.uploadedByName}</span>
                        </div>
                      </div>

                      {attachment.description && (
                        <p className="text-sm text-gray-700 mt-2">
                          {attachment.description}
                        </p>
                      )}

                      {attachment.tags.length > 0 && (
                        <div className="flex items-center space-x-2 mt-2">
                          <Tag className="h-4 w-4 text-gray-400" />
                          <div className="flex flex-wrap gap-1">
                            {attachment.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Badge className={getCategoryColor(attachment.category)}>
                      {getCategoryDisplay(attachment.category)}
                    </Badge>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(attachment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDownload(attachment)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(attachment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(attachment)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Related Entity Information */}
                {attachment.relatedEntityType && attachment.relatedEntityId && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="font-medium">Related to:</span>
                      <Badge variant="outline">
                        {attachment.relatedEntityType} - {attachment.relatedEntityId}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Public/Private Indicator */}
                <div className="mt-2">
                  <Badge
                    variant={attachment.isPublic ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {attachment.isPublic ? 'Public' : 'Private'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
