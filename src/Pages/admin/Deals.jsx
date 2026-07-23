import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { dealsApi, restaurantsApi } from "../../services/adminApi";
import { BASE_URL } from "../../services/authApi";
import Loader from "../../Components/common/Loader";
import Modal from "../../Components/common/Modal";
import Button from "../../Components/common/Button";
import Input from "../../Components/common/Input";
import { Plus, Pencil, Trash2, BadgePercent } from "lucide-react";

const asList = (res) =>
  res?.data || res?.results || (Array.isArray(res) ? res : []);

// Confirmed from DealSerializer: required fields are name, combo_price, restaurant_id.
// description/image are optional but included in the model.
const EMPTY_FORM = {
  name: "",
  description: "",
  combo_price: "",
  restaurant_id: "",
  is_active: true,
  image: null,
};
const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [preview, setPreview] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [dealsRes, restaurantsRes] = await Promise.all([
        dealsApi.getAll(),
        restaurantsApi.getAll(),
      ]);
      setDeals(asList(dealsRes));
      setRestaurants(asList(restaurantsRes));
    } catch (err) {
      setError(err.message || "Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // DealSerializer returns "restaurant_id" as a plain number (not a nested
  // object like MenuItem's "restaurant"), so we look the name up ourselves.
  const restaurantName = (restaurantId) =>
    restaurants.find((r) => r.id === restaurantId)?.name || "—";

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setPreview(null);
    setModalOpen(true);
  };

  const openEditModal = (deal) => {
    setEditingId(deal.id);
    setForm({
      name: deal.name || "",
      description: deal.description || "",
      combo_price: deal.combo_price || "",
      restaurant_id: deal.restaurant_id || "",
      is_active: deal.is_active ?? true,
      image: null,
    });
    setPreview(deal.image ? `${BASE_URL}${deal.image}` : null);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, image: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingId) {
        await dealsApi.update(editingId, form);
      } else {
        await dealsApi.create(form);
      }
      toast.success(editingId ? "Deal updated" : "Deal created");
      setModalOpen(false);
      fetchAll();
    } catch (err) {
      toast.error(err.message || "Failed to save deal");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (deal) => {
    if (!confirm(`Delete "${deal.name}"? This can't be undone.`)) return;
    try {
      await dealsApi.remove(deal.id);
      setDeals((prev) => prev.filter((d) => d.id !== deal.id));
      toast.success("Deal deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete deal");
    }
  };

  if (loading) return <Loader fullPage label="Loading deals..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Deals</h1>
          <p className="text-sm text-gray-500 mt-1">{deals.length} deals</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={16} /> Add Deal
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center py-10">
            No deals yet. Click "Add Deal" to create one.
          </p>
        ) : (
          deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
                {deal.image ? (
                  <img
                    src={`${BASE_URL}${deal.image}`}
                    alt={deal.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BadgePercent className="text-gray-300" size={32} />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-brand-dark truncate">
                  {deal.name}
                </h3>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {restaurantName(deal.restaurant_id)}
                </p>
                <p className="text-sm text-brand-orange font-semibold mt-1">
                  £{deal.combo_price}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(deal)}
                  >
                    <Pencil size={13} /> Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(deal)}
                  >
                    <Trash2 size={13} /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Deal" : "Add Deal"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Deal Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Description"
            name="description"
            as="textarea"
            value={form.description}
            onChange={handleChange}
          />
          <Input
            label="Combo Price"
            name="combo_price"
            type="number"
            step="0.01"
            value={form.combo_price}
            onChange={handleChange}
            required
          />

          <Input
            label="Restaurant"
            name="restaurant_id"
            as="select"
            value={form.restaurant_id}
            onChange={handleChange}
            required
          >
            <option value="">Select restaurant</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </Input>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="h-4 w-4 accent-brand-orange"
            />
            Active (visible to customers / orderable)
          </label>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Image
            </label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-xl border border-gray-200 mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-gray-600"
            />
            {editingId && (
              <p className="text-xs text-gray-400 mt-1">
                Leave empty to keep the current image.
              </p>
            )}
          </div>

          <Button type="submit" full loading={saving}>
            {editingId ? "Save Changes" : "Create Deal"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Deals;
