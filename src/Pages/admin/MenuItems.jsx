import { useEffect, useState } from "react";
import { menuItemsApi, restaurantsApi, categoriesApi } from "../../services/adminApi";
import { BASE_URL } from "../../services/authApi";
import Loader from "../../Components/common/Loader";
import Modal from "../../Components/common/Modal";
import Button from "../../Components/common/Button";
import Input from "../../Components/common/Input";
import { Plus, Pencil, Trash2, UtensilsCrossed } from "lucide-react";

const asList = (res) => res?.data || res?.results || (Array.isArray(res) ? res : []);

// Confirmed from MenuItemSerializer: model FK fields are literally named restaurant_id / category_id
const EMPTY_FORM = { name: "", description: "", price: "", category_id: "", restaurant_id: "", image: null };

const MenuItems = () => {
  const [items, setItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
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
      const [itemsRes, restaurantsRes, categoriesRes] = await Promise.all([
        menuItemsApi.getAll(),
        restaurantsApi.getAll(),
        categoriesApi.getAll(),
      ]);
      setItems(asList(itemsRes));
      setRestaurants(asList(restaurantsRes));
      setCategories(asList(categoriesRes));
    } catch (err) {
      setError(err.message || "Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setPreview(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      // GET responses nest these under "category"/"restaurant" (read-only, from MenuItemSerializer),
      // but create/update expect the flat "category_id"/"restaurant_id" keys.
      category_id: item.category?.id || "",
      restaurant_id: item.restaurant?.id || "",
      image: null,
    });
    setPreview(item.image ? `${BASE_URL}${item.image}` : null);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        await menuItemsApi.update(editingId, form);
      } else {
        await menuItemsApi.create(form);
      }
      setModalOpen(false);
      fetchAll();
    } catch (err) {
      alert(err.message || "Failed to save menu item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.name}"? This can't be undone.`)) return;
    try {
      await menuItemsApi.remove(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      alert(err.message || "Failed to delete menu item");
    }
  };

  if (loading) return <Loader fullPage label="Loading menu items..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Menu Items</h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} items</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={16} /> Add Menu Item
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
                <th className="px-5 py-3">Item</th>
                <th className="px-5 py-3">Restaurant</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                    No menu items yet.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                          {item.image ? (
                            <img src={`${BASE_URL}${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <UtensilsCrossed className="text-gray-300" size={16} />
                          )}
                        </div>
                        <span className="font-medium text-brand-dark">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{item.restaurant?.name || "—"}</td>
                    <td className="px-5 py-3 text-gray-600">{item.category?.name || "—"}</td>
                    <td className="px-5 py-3 text-gray-600">£{item.price}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-orange hover:bg-brand-orange/10 transition-colors cursor-pointer"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
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
        title={editingId ? "Edit Menu Item" : "Add Menu Item"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
          <Input
            label="Description"
            name="description"
            as="textarea"
            value={form.description}
            onChange={handleChange}
          />
          <Input
            label="Price"
            name="price"
            type="number"
            step="0.01"
            value={form.price}
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
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </Input>

          <Input
            label="Category"
            name="category_id"
            as="select"
            value={form.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Input>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Image</label>
            {preview && (
              <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-gray-200 mb-2" />
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm text-gray-600" />
            {editingId && <p className="text-xs text-gray-400 mt-1">Leave empty to keep the current image.</p>}
          </div>

          <Button type="submit" full loading={saving}>
            {editingId ? "Save Changes" : "Create Menu Item"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default MenuItems;
