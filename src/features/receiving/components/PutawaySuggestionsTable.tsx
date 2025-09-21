import React from 'react';
import { PutawaySuggestion } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, CheckCircle, XCircle, Clock, MapPin } from 'lucide-react';

interface PutawaySuggestionsTableProps {
  suggestions: PutawaySuggestion[];
  onEdit: (suggestion: PutawaySuggestion) => void;
  onDelete: (suggestion: PutawaySuggestion) => void;
  onView: (suggestion: PutawaySuggestion) => void;
  onApprove?: (suggestion: PutawaySuggestion) => void;
  onReject?: (suggestion: PutawaySuggestion) => void;
}

export function PutawaySuggestionsTable({
  suggestions,
  onEdit,
  onDelete,
  onView,
  onApprove,
  onReject
}: PutawaySuggestionsTableProps) {
  const getStatusColor = (status: PutawaySuggestion['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: PutawaySuggestion['priority']) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessibilityColor = (accessibility: PutawaySuggestion['accessibility']) => {
    switch (accessibility) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'DIFFICULT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: PutawaySuggestion['status']) => {
    switch (status) {
      case 'APPROVED':
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const canApprove = (suggestion: PutawaySuggestion) => suggestion.status === 'PENDING';
  const canReject = (suggestion: PutawaySuggestion) => suggestion.status === 'PENDING';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Putaway Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No putaway suggestions found. Generate suggestions from a GRN to get started.
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{suggestion.productName}</h3>
                    <p className="text-sm text-gray-600">{suggestion.suggestedLocationName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(suggestion.priority)}>
                      {suggestion.priority}
                    </Badge>
                    <Badge className={getStatusColor(suggestion.status)}>
                      {getStatusIcon(suggestion.status)}
                      <span className="ml-1">{suggestion.status}</span>
                    </Badge>
                    <Badge className={getAccessibilityColor(suggestion.accessibility)}>
                      {suggestion.accessibility}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(suggestion)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(suggestion)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(suggestion)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Location Details</p>
                    <div className="space-y-1 mt-1">
                      <p className="text-gray-600">Type: {suggestion.suggestedLocationType}</p>
                      <p className="text-gray-600">Capacity Check: {suggestion.capacityCheck ? 'Yes' : 'No'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Reason</p>
                    <p className="text-gray-600 text-sm mt-1">{suggestion.reason}</p>
                  </div>

                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-gray-600">
                      {new Date(suggestion.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {suggestion.status === 'PENDING' && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {onApprove && (
                      <Button
                        size="sm"
                        onClick={() => onApprove(suggestion)}
                      >
                        Approve
                      </Button>
                    )}
                    {onReject && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReject(suggestion)}
                      >
                        Reject
                      </Button>
                    )}
                  </div>
                )}

                <div className="mt-3 text-xs text-gray-500">
                  Updated: {new Date(suggestion.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
