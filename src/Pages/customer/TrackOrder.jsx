import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { cartApi } from "../../services/cartApi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp, MapPin, Package } from "lucide-react";

// Matches Order.CHOICE_FIELDS_ORDER_STATUS exactly (cancelled handled separately below)
const STEPS = [
  { key: "pending", label: "Order Placed" },
  { key: "accepted", label: "Accepted" },
  { key: "preparing", label: "Preparing" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

const StatusStepper = ({ currentStatus }) => {
  if (currentStatus === "cancelled") {
    return (
      <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400">
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className="flex items-center w-full overflow-x-auto py-2">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <div key={step.key} className="flex items-center flex-1 min-w-[90px]">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  done
                    ? "bg-brand-orange text-white"
                    : "bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-500"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`mt-2 text-[11px] text-center leading-tight ${
                  done
                    ? "text-brand-dark dark:text-white font-semibold"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-[2px] flex-1 -mt-5 ${
                  i < currentIndex
                    ? "bg-brand-orange"
                    : "bg-gray-200 dark:bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-[#0b1030] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center shrink-0">
            <Package size={18} className="text-brand-orange" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-brand-dark dark:text-white truncate">
              Order #{order.order_id} — {order.restaurant?.name || "Restaurant"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {new Date(order.created_at).toLocaleString()} · £
              {order.total_price}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={18} className="text-gray-400 shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-gray-400 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-100 dark:border-white/10 pt-4">
          <StatusStepper currentStatus={order.current_status} />

          {order.delivery_address && (
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
              <MapPin size={16} className="shrink-0 mt-0.5 text-brand-orange" />
              <span>{order.delivery_address}</span>
            </div>
          )}

          <div className="space-y-1">
            {(order.items || []).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-brand-dark dark:text-white">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  £{item.subtotal}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function TrackOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to track your orders");
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await cartApi.getUserOrders();
        setOrders(res?.data || []);
      } catch (err) {
        toast.error(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-orange border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark dark:text-white mb-2">
        Track Your Orders
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Tap an order to see its live status.
      </p>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.order_id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
