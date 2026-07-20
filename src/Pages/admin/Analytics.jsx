import { useEffect, useState } from "react";
import { analyticsApi } from "../../services/adminApi";
import Loader from "../../Components/common/Loader";
import ChartCanvas from "../../Components/common/ChartCanvas";

const Card = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
    <h3 className="text-sm font-bold text-brand-dark">{title}</h3>
    {subtitle && <p className="text-xs text-gray-400 mb-4">{subtitle}</p>}
    {!subtitle && <div className="mb-4" />}
    {children}
  </div>
);

const EmptyState = () => (
  <div className="flex items-center justify-center text-sm text-gray-400">
    No data yet — this fills in once you have delivered orders.
  </div>
);

// Chart.js wants a flat palette of colors for bar/doughnut charts
const PALETTE = [
  "#fc8a06",
  "#008543",
  "#03081f",
  "#3b82f6",
  "#a855f7",
  "#ef4444",
  "#eab308",
  "#14b8a6",
];

const formatPeriod = (period, range) => {
  const d = new Date(period);
  if (range === "monthly")
    return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
  if (range === "weekly")
    return `Wk of ${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Each of these matches the exact shape confirmed from your Django views
  const [ordersByStatus, setOrdersByStatus] = useState([]); // [{ current_status, count }]
  const [popularItems, setPopularItems] = useState([]); // [{ menu_item__name, total_sold, ... }]
  const [popularDeals, setPopularDeals] = useState([]); // [{ deal__name, total_sold, ... }]
  const [revenueByRestaurant, setRevenueByRestaurant] = useState([]); // [{ restaurant__name, total_revenue, total_orders }]
  const [revenueOverTime, setRevenueOverTime] = useState({
    range: "daily",
    data: [],
  }); // { range, data: [{ period, total_revenue, total_orders }] }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [obs, pi, pd, rbr, rot] = await Promise.all([
          analyticsApi.ordersByStatus(),
          analyticsApi.popularItems(),
          analyticsApi.popularDeals(),
          analyticsApi.revenueByRestaurant(),
          analyticsApi.revenueOverTime(),
        ]);

        setOrdersByStatus(obs?.data || []);
        setPopularItems(pi?.data || []);
        setPopularDeals(pd?.data || []);
        setRevenueByRestaurant(rbr?.data || []);
        setRevenueOverTime({
          range: rot?.range || "daily",
          data: rot?.data || [],
        });
      } catch (err) {
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <Loader fullPage label="Loading analytics..." />;

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
        <h1 className="text-2xl font-bold text-brand-dark">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">
          All figures below only count{" "}
          <span className="font-medium">delivered</span> orders, except Orders
          by Status which counts every order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Over Time - line chart */}
        <Card
          title="Revenue Over Time"
          subtitle={`Range: ${revenueOverTime.range}`}
        >
          {revenueOverTime.data.length === 0 ? (
            <EmptyState />
          ) : (
            <ChartCanvas
              type="line"
              data={{
                labels: revenueOverTime.data.map((row) =>
                  formatPeriod(row.period, revenueOverTime.range),
                ),
                datasets: [
                  {
                    label: "Revenue (£)",
                    data: revenueOverTime.data.map((row) => row.total_revenue),
                    borderColor: "#fc8a06",
                    backgroundColor: "rgba(252,138,6,0.15)",
                    fill: true,
                    tension: 0.3,
                  },
                ],
              }}
            />
          )}
        </Card>

        {/* Orders by Status - doughnut chart */}
        <Card title="Orders by Status">
          {ordersByStatus.length === 0 ? (
            <EmptyState />
          ) : (
            <ChartCanvas
              type="doughnut"
              data={{
                labels: ordersByStatus.map((row) =>
                  row.current_status.replaceAll("_", " "),
                ),
                datasets: [
                  {
                    data: ordersByStatus.map((row) => row.count),
                    backgroundColor: PALETTE,
                  },
                ],
              }}
            />
          )}
        </Card>

        {/* Revenue by Restaurant - bar chart */}
        <Card title="Revenue by Restaurant">
          {revenueByRestaurant.length === 0 ? (
            <EmptyState />
          ) : (
            <ChartCanvas
              type="bar"
              data={{
                labels: revenueByRestaurant.map((row) => row.restaurant__name),
                datasets: [
                  {
                    label: "Revenue (£)",
                    data: revenueByRestaurant.map((row) => row.total_revenue),
                    backgroundColor: "#008543",
                    borderRadius: 6,
                  },
                ],
              }}
              options={{ indexAxis: "y" }}
            />
          )}
        </Card>

        {/* Popular Items - bar chart */}
        <Card title="Popular Items" subtitle="By quantity sold">
          {popularItems.length === 0 ? (
            <EmptyState />
          ) : (
            <ChartCanvas
              type="bar"
              data={{
                labels: popularItems.map((row) => row.menu_item__name),
                datasets: [
                  {
                    label: "Units sold",
                    data: popularItems.map((row) => row.total_sold),
                    backgroundColor: "#fc8a06",
                    borderRadius: 6,
                  },
                ],
              }}
            />
          )}
        </Card>

        {/* Popular Deals - bar chart */}
        <Card title="Popular Deals" subtitle="By quantity sold">
          {popularDeals.length === 0 ? (
            <EmptyState />
          ) : (
            <ChartCanvas
              type="bar"
              data={{
                labels: popularDeals.map((row) => row.deal__name),
                datasets: [
                  {
                    label: "Units sold",
                    data: popularDeals.map((row) => row.total_sold),
                    backgroundColor: "#3b82f6",
                    borderRadius: 6,
                  },
                ],
              }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
