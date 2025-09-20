import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransferApproval } from '../api';

const approvalSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'CONDITIONALLY_APPROVED']),
  comments: z.string().min(1, 'Comments are required'),
  conditions: z.array(z.string()).optional(),
});

type ApprovalFormData = z.infer<typeof approvalSchema>;

interface TransferApprovalFormProps {
  transferNumber: string;
  onSubmit: (data: ApprovalFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TransferApprovalForm({
  transferNumber,
  onSubmit,
  onCancel,
  isLoading
}: TransferApprovalFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalSchema),
    defaultValues: {
      status: 'APPROVED',
      comments: '',
      conditions: [],
    },
  });

  const selectedStatus = watch('status');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          Approve Transfer: {transferNumber}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="status">Approval Decision *</Label>
            <select
              id="status"
              {...register('status')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="APPROVED">Approve</option>
              <option value="CONDITIONALLY_APPROVED">Conditionally Approve</option>
              <option value="REJECTED">Reject</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments *</Label>
            <Textarea
              id="comments"
              {...register('comments')}
              placeholder="Enter approval comments or rejection reason"
              rows={4}
            />
            {errors.comments && (
              <p className="text-sm text-red-600">{errors.comments.message}</p>
            )}
          </div>

          {selectedStatus === 'CONDITIONALLY_APPROVED' && (
            <div className="space-y-2">
              <Label>Conditions</Label>
              <Textarea
                placeholder="Enter conditions for approval (optional)"
                rows={3}
              />
              <p className="text-xs text-gray-500">
                Enter any conditions that must be met for this transfer to proceed
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Approval Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Approve:</strong> Transfer meets all requirements and can proceed</li>
              <li>• <strong>Conditionally Approve:</strong> Transfer can proceed with specific conditions</li>
              <li>• <strong>Reject:</strong> Transfer cannot proceed due to issues</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Submit Approval'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
