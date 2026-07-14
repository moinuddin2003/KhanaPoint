import React from "react";
import {
  DollarSign,
  ShoppingBag,
  Store,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

export default function Analytics({
  overview,
  ordersByStatus,
  popularDeals,
  popularItems,
  revenueByRestaurant,
  revenueOverTime,
}) {
  // Dynamic status mapping for accurate labels
  const statusLabels = ordersByStatus.map(
    (item) => item.current_status || "Unknown",
  );
  const statusCounts = ordersByStatus.map((item) => item.count);

  const statusChartData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusCounts,
        backgroundColor: [
          "#34D399", // Delivered / Completed (Green)
          "#FBBF24", // Pending (Yellow)
          "#60A5FA", // Processing (Blue)
          "#F87171", // Cancelled (Red)
        ],
        borderWidth: 1,
      },
    ],
  };

  // Timeline Revenue mapped to period and total_revenue keys from backend
  const timelineLabels = revenueOverTime.map(
    (item) => item.period || "No Date",
  );
  const timelineRevenue = revenueOverTime.map(
    (item) => item.total_revenue || 0,
  );

  const revenueTimelineData = {
    labels: timelineLabels,
    datasets: [
      {
        label: "Revenue ($)",
        data: timelineRevenue,
        borderColor: "#2563EB",
        backgroundColor: "rgba(37, 99, 235, 0.05)",
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const restaurantLabels = revenueByRestaurant.map(
    (item) => item.restaurant_name || "Generic",
  );
  const restaurantRevenue = revenueByRestaurant.map(
    (item) => item.revenue || 0,
  );

  const restaurantChartData = {
    labels: restaurantLabels,
    datasets: [
      {
        label: "Gross Sales ($)",
        data: restaurantRevenue,
        backgroundColor: "rgba(99, 102, 241, 0.85)",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* 1. Metric Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Orders
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {overview.total_orders}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Revenue
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              ${Number(overview.total_revenue || 0).toFixed(2)}
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Restaurants
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {overview.active_restaurants}
            </h3>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Store className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Users
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {overview.total_users}
            </h3>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 2. Charts Row One */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" /> Revenue Timeline
          </h4>
          <div className="h-64">
            <Line
              data={revenueTimelineData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 mb-4">
            Orders by Status
          </h4>
          <div className="h-64 flex items-center justify-center">
            {ordersByStatus.length > 0 ? (
              <Doughnut
                data={statusChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            ) : (
              <p className="text-xs text-slate-400">
                No status records present.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Charts Row Two */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <h4 className="text-sm font-bold text-slate-900 mb-4">
            Revenue Contribution by Restaurant
          </h4>
          <div className="h-64">
            <Bar
              data={restaurantChartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Popular Items & Deals Lists */}
        <div className="grid grid-rows-2 gap-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Most Sold Items
            </h4>
            <div className="space-y-2 overflow-y-auto h-24">
              {popularItems.length > 0 ? (
                popularItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-xs border-b border-slate-50 pb-1.5"
                  >
                    <span className="font-semibold text-slate-700">
                      {item.item_name}
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                      {item.total_sold} units
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No popular items sold yet.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Hot Active Deals
            </h4>
            <div className="space-y-2 overflow-y-auto h-24">
              {popularDeals.length > 0 ? (
                popularDeals.map((deal, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-xs border-b border-slate-50 pb-1.5"
                  >
                    <span className="font-semibold text-slate-700">
                      {deal.deal_name}
                    </span>
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                      {deal.total_redeemed} used
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No active deals redeemed yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
