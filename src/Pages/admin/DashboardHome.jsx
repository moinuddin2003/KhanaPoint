import { useEffect, useState } from "react";
import { Link } from "react-router";
import { analyticsApi } from "../../services/adminApi";
import Loader from "../../Components/common/Loader";
import { Package, DollarSign, Store, Users, ArrowRight } from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500 truncate">{label}</p>
      <p className="text-2xl font-bold text-brand-dark truncate">{value}</p>
    </div>
  </div>
);

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Matches AdminOverviewView exactly: { total_orders, total_revenue, active_restaurants, total_users }
  const [overview, setOverview] = useState({
    total_orders: 0,
    total_revenue: 0,
    active_restaurants: 0,
    total_users: 0,
  });
  // Matches AdminOrdersByStatusView exactly: [{ current_status, count }]
  const [ordersByStatus, setOrdersByStatus] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ov, obs] = await Promise.all([
          analyticsApi.overview(),
          analyticsApi.ordersByStatus(),
        ]);
        setOverview(ov?.data || {});
        setOrdersByStatus(obs?.data || []);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader fullPage label="Loading dashboard..." />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Quick overview of your platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Orders" value={overview.total_orders} color="bg-brand-orange" />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`£${overview.total_revenue}`}
          color="bg-brand-green"
        />
        <StatCard icon={Store} label="Active Restaurants" value={overview.active_restaurants} color="bg-blue-500" />
        <StatCard icon={Users} label="Users" value={overview.total_users} color="bg-purple-500" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-brand-dark">Orders by Status</h3>
          <Link
            to="/admin/analytics"
            className="flex items-center gap-1 text-xs font-semibold text-brand-orange hover:underline"
          >
            View full analytics <ArrowRight size={13} />
          </Link>
        </div>

        {ordersByStatus.length === 0 ? (
          <p className="text-sm text-gray-400">No orders yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {ordersByStatus.map((row) => (
              <div
                key={row.current_status}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize ${
                  STATUS_COLORS[row.current_status] || "bg-gray-100 text-gray-600"
                }`}
              >
                {row.current_status.replaceAll("_", " ")} — {row.count}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
