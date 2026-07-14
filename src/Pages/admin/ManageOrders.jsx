import React, { useState } from "react";
import { Search } from "lucide-react";

export default function ManageOrders({ initialOrders = [], apiBaseUrl }) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle live PATCH update
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

      const response = await fetch(`${apiBaseUrl}/order/admin/orders/${orderId}/status/`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert("Failed to update status on the backend server.");
      }
    } catch (err) {
      console.error("Error patching order status:", err);
    }
  };

  // Filter orders by ID, Customer Name, or Restaurant Name
  const filteredOrders = orders.filter(
    (order) =>
      order.id?.toString().includes(searchTerm) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.restaurant_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search by Order ID, Customer, or Restaurant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-500 shadow-sm transition"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold">
          {filteredOrders.length} Orders Listed
        </span>
      </div>

      {/* Orders Table view */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Restaurant</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4">Modify Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {order.restaurant_name}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-900">
                      ${Number(order.total_price || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          order.status === "delivered" ||
                          order.status === "completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : order.status === "processing"
                              ? "bg-blue-50 text-blue-700"
                              : order.status === "cancelled"
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateStatus(order.id, e.target.value)
                        }
                        className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block p-1.5 font-semibold transition cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-xs text-slate-400 font-medium"
                  >
                    No matching orders match your current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
