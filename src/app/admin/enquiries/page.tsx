'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/enquiries', { params: { search, status } });
      setEnquiries(data.items);
    } catch {
      // Silently handle — admin will see empty state
    }
    setLoading(false);
  }, [search, status]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/enquiries/${id}/status`, { status: newStatus });
      setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status: newStatus } : e));
    } catch {
      // Silently handle
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Enquiries</h1>
        <div className="flex gap-2">
          <input 
            placeholder="Search name, email, phone..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-primary dark:bg-slate-800 dark:border-slate-700"
          />
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-primary dark:bg-slate-800 dark:border-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No enquiries found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name &amp; Contact</th>
                  <th className="px-4 py-3 font-semibold">Package &amp; Destination</th>
                  <th className="px-4 py-3 font-semibold">Travel Details</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700">
                {enquiries.map((e) => (
                  <tr key={e._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800 dark:text-white">{e.name}</div>
                      <div className="text-slate-500">{e.email}</div>
                      <div className="text-slate-500">{e.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-primary">{e.packageName}</div>
                      <div className="text-slate-500">{e.destination}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{new Date(e.travelDate).toLocaleDateString()}</div>
                      <div className="text-slate-500">{e.travelers} Travelers</div>
                      {e.specialRequirements && <div className="text-xs text-slate-400 mt-1 max-w-[200px] truncate" title={e.specialRequirements}>Note: {e.specialRequirements}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={e.status}
                        onChange={(ev) => updateStatus(e._id, ev.target.value)}
                        className={`rounded-lg border px-2 py-1 text-xs font-bold outline-none ${
                          e.status === 'New' ? 'bg-blue-100 text-blue-700' :
                          e.status === 'Contacted' ? 'bg-orange-100 text-orange-700' :
                          e.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                          'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
