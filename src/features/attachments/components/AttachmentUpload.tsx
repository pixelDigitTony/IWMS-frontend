import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, X, File, Image, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { requestUpload, uploadFile, createAttachment, Attachment, UploadRequest } from '../api';

const uploadSchema = z.object({
  file: z.instanceof(File, { message: 'Please select a file' }),
  category: z.enum(['GRN', 'DELIVERY_NOTE', 'INVOICE', 'PHOTO', 'PACKING_LIST', 'SHIPPING_LABEL', 'OTHER']),
  description: z.string().optional(),
  relatedEntityType: z.enum(['ORDER', 'SHIPMENT', 'PICKING_LIST', 'RECEIVING', 'INVENTORY', 'OTHER']).optional(),
  relatedEntityId: z.string().optional(),
  isPublic: z.boolean().default(false),
  tags: z.string().optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface AttachmentUploadProps {
  onUploadComplete?: (attachment: Attachment) => void;
  onCancel?: () => void;
  maxFileSize?: number; // in bytes
  acceptedFileTypes?: string[];
  entities?: Array<{ type: string; id: string; name: string }>;
}

export function AttachmentUpload({
  onUploadComplete,
  onCancel,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  acceptedFileTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'],
  entities = []
}: AttachmentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  });

  const selectedFile = watch('file');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setValue('file', file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setValue('file', file);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    if (file.size > maxFileSize) {
      setErrorMessage(`File size exceeds ${maxFileSize / 1024 / 1024}MB limit`);
      return false;
    }

    const isAccepted = acceptedFileTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.match(type.replace('*', '.*'));
    });

    if (!isAccepted) {
      setErrorMessage('File type not supported');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!data.file) return;

    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      // Request upload URL from backend
      const uploadRequest: UploadRequest = {
        filename: data.file.name,
        fileSize: data.file.size,
        fileType: data.file.type,
        category: data.category,
        description: data.description,
        relatedEntityType: data.relatedEntityType,
        relatedEntityId: data.relatedEntityId,
        isPublic: data.isPublic,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      };

      const { presignedUrl, attachmentId } = await requestUpload(uploadRequest);

      // Upload file to presigned URL
      await uploadFile(presignedUrl, data.file, (progress) => {
        setUploadProgress(progress);
      });

      // Create attachment record
      const attachment: Omit<Attachment, 'id' | 'uploadedAt'> = {
        filename: data.file.name,
        originalName: data.file.name,
        fileSize: data.file.size,
        fileType: data.file.type,
        category: data.category,
        description: data.description,
        relatedEntityType: data.relatedEntityType,
        relatedEntityId: data.relatedEntityId,
        uploadedBy: 'current-user', // In real app, get from auth context
        uploadedByName: 'Current User', // In real app, get from auth context
        url: presignedUrl,
        isPublic: data.isPublic,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      };

      const createdAttachment = await createAttachment(attachment);

      setUploadStatus('success');
      setUploadProgress(100);

      if (onUploadComplete) {
        onUploadComplete(createdAttachment);
      }

      // Reset form after successful upload
      reset();

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage('Upload failed. Please try again.');
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-8 w-8 text-blue-500" />;
    if (file.type.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const getCategoryOptions = () => [
    { value: 'GRN', label: 'Goods Receipt Note' },
    { value: 'DELIVERY_NOTE', label: 'Delivery Note' },
    { value: 'INVOICE', label: 'Invoice' },
    { value: 'PHOTO', label: 'Photo' },
    { value: 'PACKING_LIST', label: 'Packing List' },
    { value: 'SHIPPING_LABEL', label: 'Shipping Label' },
    { value: 'OTHER', label: 'Other' },
  ];

  const getEntityTypeOptions = () => [
    { value: 'ORDER', label: 'Order' },
    { value: 'SHIPMENT', label: 'Shipment' },
    { value: 'PICKING_LIST', label: 'Picking List' },
    { value: 'RECEIVING', label: 'Receiving' },
    { value: 'INVENTORY', label: 'Inventory' },
    { value: 'OTHER', label: 'Other' },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Attachment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              onChange={handleChange}
              accept={acceptedFileTypes.join(',')}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  {getFileIcon(selectedFile)}
                  <div className="text-left">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setValue('file', undefined as any);
                      setErrorMessage('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {uploadStatus === 'uploading' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                      <span className="text-sm text-gray-600">Uploading...</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                {uploadStatus === 'success' && (
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm">Upload completed successfully!</span>
                  </div>
                )}

                {uploadStatus === 'error' && (
                  <div className="flex items-center justify-center space-x-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">{errorMessage}</span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your file here, or{' '}
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-500 underline"
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-gray-500">
                  Maximum file size: {maxFileSize / 1024 / 1024}MB
                </p>
                <p className="text-sm text-gray-500">
                  Supported types: {acceptedFileTypes.join(', ')}
                </p>
              </div>
            )}
          </div>

          {errors.file && (
            <p className="text-sm text-red-600">{errors.file.message}</p>
          )}

          {errorMessage && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                {...register('category')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select category</option>
                {getCategoryOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="relatedEntityType">Related To</Label>
              <select
                id="relatedEntityType"
                {...register('relatedEntityType')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Not related</option>
                {getEntityTypeOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter description (optional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              {...register('tags')}
              placeholder="Enter tags separated by commas (optional)"
            />
            <p className="text-xs text-gray-500">
              Example: invoice, urgent, Q1 2024
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              {...register('isPublic')}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isPublic">Make file publicly accessible</Label>
          </div>

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={!selectedFile || uploadStatus === 'uploading'}
            >
              {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload File'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
