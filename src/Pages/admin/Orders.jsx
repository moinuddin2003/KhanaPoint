import { toast } from "react-toastify";
import { useEffect, useState, Fragment } from "react";
import { ordersApi } from "../../services/adminApi";
import Loader from "../../Components/common/Loader";
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

// Confirmed exactly from Order.CHOICE_FIELDS_ORDER_STATUS in order/models.py
const STATUS_OPTIONS = ["pending", "accepted", "preparing", "out_for_delivery", "delivered", "cancelled"];

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const asList = (res) => res?.data || res?.results || (Array.isArray(res) ? res : []);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await ordersApi.getAll();
      setOrders(asList(res));
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      // Confirmed from AdminUpdateOrderStatusView: body key is "status"
      await ordersApi.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.order_id === orderId ? { ...o, current_status: newStatus } : o))
      );
      toast.success(`Order #${orderId} status updated to "${newStatus.replaceAll("_", " ")}"`);
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader fullPage label="Loading orders..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 h-10 rounded-full border border-gray-200 text-sm font-medium text-brand-dark hover:border-brand-orange hover:text-brand-orange transition-colors cursor-pointer"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Restaurant</th>
                <th className="px-5 py-3">Delivery Address</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Update</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-400">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isExpanded = expandedId === order.order_id;
                  return (
                    <Fragment key={order.order_id}>
                      <tr className="hover:bg-gray-50/60">
                        <td className="px-5 py-4 font-medium text-brand-dark">#{order.order_id}</td>
                        <td className="px-5 py-4 text-gray-600">{order.restaurant?.name || "—"}</td>
                        <td className="px-5 py-4 text-gray-600 max-w-[220px] truncate" title={order.delivery_address}>
                          {order.delivery_address || "—"}
                        </td>
                        <td className="px-5 py-4 text-gray-600">£{order.total_price}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                              STATUS_COLORS[order.current_status] || "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {order.current_status || "unknown"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={order.current_status || ""}
                            disabled={updatingId === order.order_id}
                            onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                            className="rounded-lg border border-gray-300 text-xs px-3 py-2 focus:border-brand-orange outline-none disabled:opacity-50"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s.replaceAll("_", " ")}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : order.order_id)}
                            className="text-gray-400 hover:text-brand-orange cursor-pointer"
                            title="View items"
                          >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="bg-gray-50 px-5 py-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</p>
                            <div className="space-y-1">
                              {(order.items || []).map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                  <span className="text-brand-dark">
                                    {item.quantity}x {item.name}{" "}
                                    <span className="text-gray-400 text-xs">({item.type})</span>
                                  </span>
                                  <span className="text-gray-600">£{item.subtotal}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
