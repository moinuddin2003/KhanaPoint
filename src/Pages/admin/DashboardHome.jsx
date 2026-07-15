import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  RefreshCw,
  AlertCircle,
  Store,
} from "lucide-react";
import Analytics from "./Analytics";
import ManageOrders from "./ManageOrders";
import ManageCatalog from "./ManageCatalog";

import { BASE_URL } from "../../services/authApi";

const TABS = [
  { key: "analytics", label: "Analytics Overview", icon: LayoutDashboard },
  { key: "orders", label: "Manage Orders", icon: ShoppingCart },
  { key: "catalog", label: "Restaurants", icon: Store },
];

const TAB_COPY = {
  analytics: {
    title: "Dashboard Analytics",
    subtitle: "Check restaurant trends, system metrics, and total summaries.",
  },
  orders: {
    title: "Order Management",
    subtitle: "Control, verify, and filter customer orders in real-time.",
  },
  catalog: {
    title: "Restaurants & Menu",
    subtitle: "Browse restaurants, categories, menu items, and active deals.",
  },
};

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core Data States
  const [overview, setOverview] = useState({
    total_orders: 0,
    total_revenue: 0,
    active_restaurants: 0,
    total_users: 0,
  });
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [popularDeals, setPopularDeals] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [revenueByRestaurant, setRevenueByRestaurant] = useState([]);
  const [revenueOverTime, setRevenueOverTime] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      };

      // NOTE: BASE_URL already ends in "/" — never prefix these paths with "/"
      const [
        resOverview,
        resStatus,
        resDeals,
        resItems,
        resRevRestaurant,
        resRevTime,
        resOrders,
      ] = await Promise.all([
        fetch(`${BASE_URL}order/admin/analytics/overview/`, { headers }),
        fetch(`${BASE_URL}order/admin/analytics/orders-by-status/`, {
          headers,
        }),
        fetch(`${BASE_URL}order/admin/analytics/popular-deals/`, { headers }),
        fetch(`${BASE_URL}order/admin/analytics/popular-items/`, { headers }),
        fetch(`${BASE_URL}order/admin/analytics/revenue-by-restaurant/`, {
          headers,
        }),
        fetch(`${BASE_URL}order/admin/analytics/revenue-over-time/`, {
          headers,
        }),
        fetch(`${BASE_URL}order/admin/orders`, { headers }),
      ]);

      if (resOverview.status === 401 || resOrders.status === 401) {
        setError("Unauthorized access. Please login as an admin.");
        return;
      }
      if (!resOverview.ok || !resStatus.ok || !resOrders.ok) {
        throw new Error("Server responded with an error status.");
      }

      const [
        dataOverview,
        dataStatus,
        dataDeals,
        dataItems,
        dataRevRestaurant,
        dataRevTime,
        dataOrders,
      ] = await Promise.all([
        resOverview.json(),
        resStatus.json(),
        resDeals.ok ? resDeals.json() : [],
        resItems.ok ? resItems.json() : [],
        resRevRestaurant.ok ? resRevRestaurant.json() : [],
        resRevTime.ok ? resRevTime.json() : [],
        resOrders.json(),
      ]);

      setOverview(dataOverview.data || dataOverview);
      setOrdersByStatus(dataStatus.data || dataStatus);
      setPopularDeals(dataDeals.data || dataDeals);
      setPopularItems(dataItems.data || dataItems);
      setRevenueByRestaurant(dataRevRestaurant.data || dataRevRestaurant);
      setRevenueOverTime(dataRevTime.data || dataRevTime);
      setOrders(dataOrders.data || dataOrders);
    } catch (err) {
      console.error("Dashboard Fetch Error: ", err);
      setError(
        "Failed to fetch admin dashboard records. Please check your network connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-slate-600 font-medium text-sm">
          Loading Live Dashboard Records...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <AlertCircle className="h-14 w-14 text-red-500 mb-3" />
        <p className="text-base font-semibold text-slate-800 text-center">
          {error}
        </p>
        <button
          onClick={fetchData}
          className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition"
        >
          Try Reloading
        </button>
      </div>
    );
  }

  const copy = TAB_COPY[activeTab];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg">
              A
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              FoodAdmin
            </span>
          </div>

          <nav className="space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
              AD
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Main Administrator
              </p>
              <p className="text-[10px] text-emerald-600 font-semibold uppercase">
                Active Session
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Page Content View */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {copy.title}
            </h1>
            <p className="text-slate-500 text-xs mt-1">{copy.subtitle}</p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3.5 py-2 border border-slate-300 rounded-lg bg-white shadow-sm hover:bg-slate-50 transition text-xs font-bold text-slate-700"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh Data
          </button>
        </header>

        {activeTab === "analytics" && (
          <Analytics
            overview={overview}
            ordersByStatus={ordersByStatus}
            popularDeals={popularDeals}
            popularItems={popularItems}
            revenueByRestaurant={revenueByRestaurant}
            revenueOverTime={revenueOverTime}
          />
        )}

        {activeTab === "orders" && (
          <ManageOrders initialOrders={orders} apiBaseUrl={BASE_URL} />
        )}

        {activeTab === "catalog" && <ManageCatalog />}
      </main>
    </div>
  );
}
