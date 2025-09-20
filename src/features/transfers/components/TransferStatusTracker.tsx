import React from 'react';
import { TransferRequest } from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

interface TransferStatusTrackerProps {
  transfer: TransferRequest;
}

export function TransferStatusTracker({ transfer }: TransferStatusTrackerProps) {
  const statusSteps = [
    { key: 'DRAFT', label: 'Draft', description: 'Transfer request created' },
    { key: 'PENDING_APPROVAL', label: 'Pending Approval', description: 'Awaiting approval' },
    { key: 'APPROVED', label: 'Approved', description: 'Transfer approved' },
    { key: 'ALLOCATED', label: 'Allocated', description: 'Items allocated' },
    { key: 'PICKED', label: 'Picked', description: 'Items picked' },
    { key: 'PACKED', label: 'Packed', description: 'Transfer packed' },
    { key: 'DISPATCHED', label: 'Dispatched', description: 'Transfer dispatched' },
    { key: 'IN_TRANSIT', label: 'In Transit', description: 'In transit' },
    { key: 'RECEIVED', label: 'Received', description: 'Transfer received' },
    { key: 'RECONCILED', label: 'Reconciled', description: 'Transfer completed' },
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === transfer.status);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <div key={step.key} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : isCurrent ? (
                    <Circle className="h-5 w-5 text-blue-500 fill-current" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300" />
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${
                      isCompleted ? 'text-green-700' :
                      isCurrent ? 'text-blue-700' :
                      'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                    {isCurrent && (
                      <Badge className="bg-blue-100 text-blue-800">
                        Current
                      </Badge>
                    )}
                  </div>

                  <p className={`text-sm mt-1 ${
                    isCompleted ? 'text-green-600' :
                    isCurrent ? 'text-blue-600' :
                    'text-gray-400'
                  }`}>
                    {step.description}
                  </p>

                  {isCurrent && transfer.updatedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Updated: {new Date(transfer.updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>

                {index < statusSteps.length - 1 && (
                  <div className="flex-shrink-0 pt-6">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">
              {currentStepIndex + 1} of {statusSteps.length} steps
            </span>
          </div>

          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStepIndex + 1) / statusSteps.length) * 100}%`
                }}
              />
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            {Math.round(((currentStepIndex + 1) / statusSteps.length) * 100)}% complete
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
