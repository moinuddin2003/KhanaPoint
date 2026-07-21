import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { dealItemsApi, dealsApi, menuItemsApi } from "../../services/adminApi";
import Loader from "../../Components/common/Loader";
import Modal from "../../Components/common/Modal";
import Button from "../../Components/common/Button";
import Input from "../../Components/common/Input";
import { Plus, Pencil, Trash2 } from "lucide-react";

const asList = (res) => res?.data || res?.results || (Array.isArray(res) ? res : []);

// Confirmed from DealItemSerializer: writable fields are deal_id, menu_item_id, quantity.
// The GET response nests the menu item under "menu_item" (read-only), but "deal_id" comes
// back as a plain number - there's no nested "deal" object - so we look the name up ourselves.
const EMPTY_FORM = { deal_id: "", menu_item_id: "", quantity: 1 };

const DealItems = () => {
  const [dealItems, setDealItems] = useState([]);
  const [deals, setDeals] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [itemsRes, dealsRes, menuRes] = await Promise.all([
        dealItemsApi.getAll(),
        dealsApi.getAll(),
        menuItemsApi.getAll(),
      ]);
      setDealItems(asList(itemsRes));
      setDeals(asList(dealsRes));
      setMenuItems(asList(menuRes));
    } catch (err) {
      setError(err.message || "Failed to load deal items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const dealName = (dealId) => deals.find((d) => d.id === dealId)?.name || "—";

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (dealItem) => {
    setEditingId(dealItem.id);
    setForm({
      deal_id: dealItem.deal_id || "",
      menu_item_id: dealItem.menu_item?.id || "",
      quantity: dealItem.quantity || 1,
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingId) {
        await dealItemsApi.update(editingId, form);
      } else {
        await dealItemsApi.create(form);
      }
      toast.success(editingId ? "Deal item updated" : "Deal item created");
      setModalOpen(false);
      fetchAll();
    } catch (err) {
      toast.error(err.message || "Failed to save deal item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (dealItem) => {
    if (!confirm("Remove this item from the deal?")) return;
    try {
      await dealItemsApi.remove(dealItem.id);
      setDealItems((prev) => prev.filter((d) => d.id !== dealItem.id));
      toast.success("Deal item deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete deal item");
    }
  };

  if (loading) return <Loader fullPage label="Loading deal items..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Deal Items</h1>
          <p className="text-sm text-gray-500 mt-1">
            Links a menu item to a deal — {dealItems.length} links
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={16} /> Add Deal Item
        </Button>
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
                <th className="px-5 py-3">Deal</th>
                <th className="px-5 py-3">Menu Item</th>
                <th className="px-5 py-3">Quantity</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dealItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-400">
                    No deal items yet.
                  </td>
                </tr>
              ) : (
                dealItems.map((di) => (
                  <tr key={di.id} className="hover:bg-gray-50/60">
                    <td className="px-5 py-3 font-medium text-brand-dark">
                      {dealName(di.deal_id)}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{di.menu_item?.name || "—"}</td>
                    <td className="px-5 py-3 text-gray-600">{di.quantity}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(di)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-orange hover:bg-brand-orange/10 transition-colors cursor-pointer"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(di)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Deal Item" : "Add Deal Item"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Deal" name="deal_id" as="select" value={form.deal_id} onChange={handleChange} required>
            <option value="">Select deal</option>
            {deals.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </Input>

          <Input
            label="Menu Item"
            name="menu_item_id"
            as="select"
            value={form.menu_item_id}
            onChange={handleChange}
            required
          >
            <option value="">Select menu item</option>
            {menuItems.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </Input>

          <Input
            label="Quantity"
            name="quantity"
            type="number"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            required
          />

          <Button type="submit" full loading={saving}>
            {editingId ? "Save Changes" : "Add to Deal"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default DealItems;
