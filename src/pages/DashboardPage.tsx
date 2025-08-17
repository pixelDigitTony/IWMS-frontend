import { useQuery } from '@tanstack/react-query';
import { getStockSummary, getAgingSummary } from '@/api/reportsApi';
import { FileUpload } from '@/features/attachments/components/FileUpload';

export function DashboardPage() {
  const summary = useQuery({ queryKey: ['stockSummary'], queryFn: getStockSummary });
  const aging = useQuery({ queryKey: ['agingSummary'], queryFn: getAgingSummary });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-600">Key warehouse KPIs and recent activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label="Total SKUs" value={summary.data?.totalSkus ?? '—'} loading={summary.isLoading} />
        <KpiCard label="Total Quantity" value={summary.data?.totalQuantity ?? '—'} loading={summary.isLoading} />
        <KpiCard label="Warehouses" value={summary.data?.warehouses ?? '—'} loading={summary.isLoading} />
      </div>

      <div className="bg-white border rounded shadow p-4">
        <h2 className="font-medium mb-2">Aging Summary</h2>
        {aging.isLoading && <div>Loading…</div>}
        {!aging.isLoading && (
          <ul className="space-y-1">
            {aging.data?.map((b) => (
              <li key={b.label} className="flex justify-between"><span>{b.label}</span><span>{b.count}</span></li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white border rounded shadow p-4">
        <h2 className="font-medium mb-2">Quick Upload</h2>
        <FileUpload folder="dashboard" />
      </div>
    </div>
  );
}

function KpiCard({ label, value, loading }: { label: string; value: number | string; loading?: boolean }) {
  return (
    <div className="bg-white border rounded shadow p-4">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-semibold">{loading ? '…' : value}</div>
    </div>
  );
}


