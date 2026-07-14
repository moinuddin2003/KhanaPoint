import React, { useState, useEffect } from "react";
import { Plus, Trash2, PlusCircle } from "lucide-react";

import { BASE_URL } from "../../services/authApi";

export default function ManageMenu() {
  const [items, setItems] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newItem, setNewItem] = useState({ item_name: "", total_sold: 0 });
  const [newDeal, setNewDeal] = useState({ deal_name: "", total_redeemed: 0 });

  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      };

      // Sirf wahi endpoints hit kar rahe hain jo project mein hain
      const [resItems, resDeals] = await Promise.all([
        fetch(`${BASE_URL}/order/admin/analytics/popular-items/`, {
          headers,
        }),
        fetch(`${BASE_URL}/order/admin/analytics/popular-deals/`, {
          headers,
        }),
      ]);

      const dataItems = await resItems.json();
      const dataDeals = await resDeals.json();

      setItems(dataItems.data || dataItems || []);
      setDeals(dataDeals.data || dataDeals || []);
    } catch (err) {
      console.error("Error fetching menu data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  // Frontend-only Add Item
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.item_name) return;

    setItems((prev) => [
      ...prev,
      { item_name: newItem.item_name, total_sold: 0 },
    ]);
    setNewItem({ item_name: "", total_sold: 0 });
  };

  // Frontend-only Add Deal
  const handleAddDeal = (e) => {
    e.preventDefault();
    if (!newDeal.deal_name) return;

    setDeals((prev) => [
      ...prev,
      { deal_name: newDeal.deal_name, total_redeemed: 0 },
    ]);
    setNewDeal({ deal_name: "", total_redeemed: 0 });
  };

  // Frontend-only Delete Item
  const handleDeleteItem = (index) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Frontend-only Delete Deal
  const handleDeleteDeal = (index) => {
    setDeals((prev) => prev.filter((_, idx) => idx !== index));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Items Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-blue-600" /> Manage Restaurant
          Menu Items
        </h3>

        <form
          onSubmit={handleAddItem}
          className="flex gap-4 mb-6 bg-slate-50 p-4 rounded-lg"
        >
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Item Name
            </label>
            <input
              type="text"
              required
              value={newItem.item_name}
              onChange={(e) =>
                setNewItem({ ...newItem, item_name: e.target.value })
              }
              placeholder="e.g. Garlic Bread"
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold text-sm px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 h-[38px]"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Item Name</th>
                <th className="px-4 py-3">Total Sold</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {item.item_name}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {item.total_sold || 0} units
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDeleteItem(idx)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-md transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deals Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-indigo-600" /> Manage Popular
          Deals & Discounts
        </h3>

        <form
          onSubmit={handleAddDeal}
          className="flex gap-4 mb-6 bg-slate-50 p-4 rounded-lg"
        >
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Deal Name
            </label>
            <input
              type="text"
              required
              value={newDeal.deal_name}
              onChange={(e) =>
                setNewDeal({ ...newDeal, deal_name: e.target.value })
              }
              placeholder="e.g. Midnight Deal"
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white font-semibold text-sm px-6 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 h-[38px]"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Deal Name</th>
                <th className="px-4 py-3">Redeemed</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deals.map((deal, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {deal.deal_name}
                  </td>
                  <td className="px-4 py-3 text-indigo-500 font-medium">
                    {deal.total_redeemed || 0} redeemed
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDeleteDeal(idx)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-md transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
