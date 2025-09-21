import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PutawaySuggestion } from '../api';

const putawaySuggestionSchema = z.object({
  suggestedLocationId: z.string().min(1, 'Suggested location is required'),
  suggestedLocationName: z.string().min(1, 'Location name is required'),
  suggestedLocationType: z.enum(['ZONE', 'BIN', 'SHELF', 'RACK']),
  reason: z.string().min(1, 'Reason is required'),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  capacityCheck: z.boolean(),
  accessibility: z.enum(['EASY', 'MEDIUM', 'DIFFICULT']),
  notes: z.string().optional(),
});

type PutawaySuggestionFormData = z.infer<typeof putawaySuggestionSchema>;

interface PutawaySuggestionFormProps {
  suggestion?: PutawaySuggestion;
  locations: Array<{ id: string; name: string; type: 'ZONE' | 'BIN' | 'SHELF' | 'RACK' }>;
  onSubmit: (data: PutawaySuggestionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PutawaySuggestionForm({
  suggestion,
  locations,
  onSubmit,
  onCancel,
  isLoading
}: PutawaySuggestionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PutawaySuggestionFormData>({
    resolver: zodResolver(putawaySuggestionSchema),
    defaultValues: {
      suggestedLocationId: suggestion?.suggestedLocationId || '',
      suggestedLocationName: suggestion?.suggestedLocationName || '',
      suggestedLocationType: suggestion?.suggestedLocationType || 'ZONE',
      reason: suggestion?.reason || '',
      priority: suggestion?.priority || 'MEDIUM',
      capacityCheck: suggestion?.capacityCheck ?? true,
      accessibility: suggestion?.accessibility || 'EASY',
      notes: suggestion?.notes || '',
    },
  });

  const capacityCheck = watch('capacityCheck');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {suggestion ? 'Edit Putaway Suggestion' : 'Create Putaway Suggestion'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="suggestedLocationId">Suggested Location *</Label>
              <select
                id="suggestedLocationId"
                {...register('suggestedLocationId')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name} ({location.type})
                  </option>
                ))}
              </select>
              {errors.suggestedLocationId && (
                <p className="text-sm text-red-600">{errors.suggestedLocationId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="suggestedLocationType">Location Type *</Label>
              <select
                id="suggestedLocationType"
                {...register('suggestedLocationType')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="ZONE">Zone</option>
                <option value="BIN">Bin</option>
                <option value="SHELF">Shelf</option>
                <option value="RACK">Rack</option>
              </select>
              {errors.suggestedLocationType && (
                <p className="text-sm text-red-600">{errors.suggestedLocationType.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Textarea
              id="reason"
              {...register('reason')}
              placeholder="Explain why this location is suggested"
              rows={3}
            />
            {errors.reason && (
              <p className="text-sm text-red-600">{errors.reason.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                {...register('priority')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessibility">Accessibility</Label>
              <select
                id="accessibility"
                {...register('accessibility')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="DIFFICULT">Difficult</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="capacityCheck"
              type="checkbox"
              {...register('capacityCheck')}
              className="rounded border-gray-300"
            />
            <Label htmlFor="capacityCheck">Perform capacity check</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Enter additional notes (optional)"
              rows={3}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Putaway Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Consider product characteristics (temperature, size, weight)</li>
              <li>• Optimize for picking frequency and accessibility</li>
              <li>• Check location capacity and availability</li>
              <li>• Follow warehouse zoning rules</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (suggestion ? 'Update Suggestion' : 'Create Suggestion')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
