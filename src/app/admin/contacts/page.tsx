"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Download, Calendar as CalendarIcon } from "lucide-react";

type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  category: string;
  subCategory: string;
  subject?: string | null;
  message: string;
  contacted: boolean;
  createdAt: string;
};

export default function ContactsPage() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredItems = items.filter((item) => {
    if (!startDate && !endDate) return true;
    const itemDate = new Date(item.createdAt);
    itemDate.setHours(0, 0, 0, 0);

    const start = startDate ? new Date(startDate) : null;
    if (start) start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    if (start && end) return itemDate >= start && itemDate <= end;
    if (start) return itemDate >= start;
    if (end) return itemDate <= end;
    return true;
  });

  const exportToExcel = () => {
    if (filteredItems.length === 0) return;

    const dataToExport = filteredItems.map((item) => ({
      Date: new Date(item.createdAt).toLocaleDateString(),
      Time: new Date(item.createdAt).toLocaleTimeString(),
      Name: item.name,
      Email: item.email,
      Phone: `${item.countryCode} ${item.phone}`,
      Category: item.category,
      SubCategory: item.subCategory,
      Subject: item.subject || "-",
      Message: item.message,
      Contacted: item.contacted ? "Yes" : "No",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");

    // Generate filename with dates if present
    let filename = "contact_submissions";
    if (startDate) filename += `_from_${startDate}`;
    if (endDate) filename += `_to_${endDate}`;
    filename += ".xlsx";

    XLSX.writeFile(workbook, filename);
  };

  const toggleContacted = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, contacted: !currentStatus }),
      });
      if (res.ok) {
        setItems(items.map(item => 
          item.id === id ? { ...item, contacted: !currentStatus } : item
        ));
      }
    } catch (err) {
      console.error("Failed to toggle contacted status", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/contact?take=50", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data?.ok) {
          setItems(data.latest || []);
        } else {
          setError("Failed to load");
        }
      } catch {
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-[100dvh] px-6 py-12 bg-gray-50/50">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black">Contact Submissions</h1>
            <p className="text-gray-600 text-sm mt-1">Manage and export your latest contact requests</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin" className="rounded-full bg-white border border-black/10 px-6 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">Back</a>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-black/10 p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filter by Date:</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-xl border border-black/10 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  placeholder="Start Date"
                />
                <span className="text-gray-400 text-sm">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-xl border border-black/10 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  placeholder="End Date"
                />
                {(startDate || endDate) && (
                  <button
                    onClick={() => { setStartDate(""); setEndDate(""); }}
                    className="text-sm text-red-500 hover:text-red-600 font-medium ml-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={exportToExcel}
              disabled={filteredItems.length === 0}
              className="flex items-center justify-center gap-2 rounded-2xl bg-black text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/10"
            >
              <Download className="w-5 h-5" />
              Download Excel ({filteredItems.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-black/10 p-20 text-center">
            <p className="text-gray-500 text-lg">No submissions found for the selected criteria.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-black/10 bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 font-bold text-gray-900 uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-4 font-bold text-gray-900 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 font-bold text-gray-900 uppercase tracking-wider">Contact Info</th>
                    <th className="px-6 py-4 font-bold text-gray-900 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 font-bold text-gray-900 uppercase tracking-wider">Subject & Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filteredItems.map((c) => (
                    <tr key={c.id} className={`hover:bg-gray-50/50 transition-colors ${c.contacted ? 'bg-green-50/30' : ''}`}>
                      <td className="px-6 py-5 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <input
                            type="checkbox"
                            checked={c.contacted}
                            onChange={() => toggleContacted(c.id, c.contacted)}
                            className="w-5 h-5 rounded-md border-black/20 text-black focus:ring-black cursor-pointer transition-all"
                          />
                          <span className={`text-[10px] font-bold uppercase tracking-tighter ${c.contacted ? 'text-green-600' : 'text-gray-400'}`}>
                            {c.contacted ? 'Contacted' : 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-black">{new Date(c.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span className="text-xs text-gray-500 font-medium mt-0.5">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-black">{c.name}</span>
                          <span className="text-gray-500 text-xs mt-0.5">{c.email}</span>
                          <span className="text-gray-400 text-[10px] mt-0.5">{c.countryCode} {c.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black text-white uppercase tracking-wider w-fit">
                            {c.category}
                          </span>
                          <span className="text-gray-600 text-xs font-medium pl-1">{c.subCategory}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="max-w-[400px]">
                          <p className="font-bold text-black text-sm mb-1 truncate">{c.subject || "No Subject"}</p>
                          <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed italic">"{c.message}"</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
