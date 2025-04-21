import React, { useEffect, useState } from 'react';
import { Activity, Brain, CheckCircle, AlertCircle } from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { DashboardStats } from '../api/types';

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentBatches, setRecentBatches] = useState<any[]>([]);
  const [recentBatchesLoading, setRecentBatchesLoading] = useState(true);
  const [recentBatchesError, setRecentBatchesError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    apiClient.getRecentBatches()
      .then(setRecentBatches)
      .catch((err) => setRecentBatchesError(err.message))
      .finally(() => setRecentBatchesLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Questions"
          value={stats?.totalQuestions ?? 0}
          icon={Brain}
          color="text-blue-600"
        />
        <StatCard
          title="Approved"
          value={stats?.approvedQuestions ?? 0}
          icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Pending Review"
          value={stats?.pendingQuestions ?? 0}
          icon={Activity}
          color="text-yellow-600"
        />
        <StatCard
          title="Failed Generation"
          value={stats?.failedQuestions ?? 0}
          icon={AlertCircle}
          color="text-red-600"
        />
      </div>

      {/* Recent Batches */}
      {recentBatchesLoading ? (
        <div>Loading...</div>
      ) : recentBatchesError ? (
        <div>Error: {recentBatchesError}</div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Batches</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentBatches.map((batch: any) => (
              <div key={batch.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {batch.template.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(batch.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <BatchStatus status={batch.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow px-6 py-4">
      <div className="flex items-center">
        <div className={`rounded-full p-3 ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function BatchStatus({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
}