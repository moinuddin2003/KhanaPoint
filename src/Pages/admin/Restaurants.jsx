import { useEffect, useState } from "react";
import { restaurantsApi } from "../../services/adminApi";
import { BASE_URL } from "../../services/authApi";
import Loader from "../../Components/common/Loader";
import Modal from "../../Components/common/Modal";
import Button from "../../Components/common/Button";
import Input from "../../Components/common/Input";
import { Plus, Pencil, Trash2, Store } from "lucide-react";

const asList = (res) => res?.data || res?.results || (Array.isArray(res) ? res : []);

// ADJUST ME: match these fields to whatever create-restaurant/update-restaurant actually accept
const EMPTY_FORM = { name: "", description: "", address: "", image: null };

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [preview, setPreview] = useState(null);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await restaurantsApi.getAll();
      setRestaurants(asList(res));
    } catch (err) {
      setError(err.message || "Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setPreview(null);
    setModalOpen(true);
  };

  const openEditModal = async (restaurant) => {
    // The list endpoint (AllRestaurantSerializer) only returns id/name/image -
    // no description/address. Fetch the full record (RestaurantSerializer) first
    // so the edit form isn't missing fields.
    setEditingId(restaurant.id);
    setModalOpen(true);
    try {
      const full = await restaurantsApi.getOne(restaurant.id);
      const data = full?.data || full;
      setForm({
        name: data.name || "",
        description: data.description || "",
        address: data.address || "",
        image: null, // leave empty - only send a new file if the admin picks one
      });
      setPreview(data.image ? `${BASE_URL}${data.image}` : null);
    } catch (err) {
      // fall back to what we already had from the list, better than nothing
      setForm({
        name: restaurant.name || "",
        description: "",
        address: "",
        image: null,
      });
      setPreview(restaurant.image ? `${BASE_URL}${restaurant.image}` : null);
    }
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
        await restaurantsApi.update(editingId, form);
      } else {
        await restaurantsApi.create(form);
      }
      setModalOpen(false);
      fetchRestaurants();
    } catch (err) {
      alert(err.message || "Failed to save restaurant");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (restaurant) => {
    if (!confirm(`Delete "${restaurant.name}"? This can't be undone.`)) return;
    try {
      await restaurantsApi.remove(restaurant.id);
      setRestaurants((prev) => prev.filter((r) => r.id !== restaurant.id));
    } catch (err) {
      alert(err.message || "Failed to delete restaurant");
    }
  };

  if (loading) return <Loader fullPage label="Loading restaurants..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Restaurants</h1>
          <p className="text-sm text-gray-500 mt-1">{restaurants.length} restaurants</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={16} /> Add Restaurant
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center py-10">
            No restaurants yet. Click "Add Restaurant" to create one.
          </p>
        ) : (
          restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
                {restaurant.image ? (
                  <img
                    src={`${BASE_URL}${restaurant.image}`}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="text-gray-300" size={32} />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-brand-dark truncate">{restaurant.name}</h3>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {restaurant.address || "No address"}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(restaurant)}>
                    <Pencil size={13} /> Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(restaurant)}>
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
        title={editingId ? "Edit Restaurant" : "Add Restaurant"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
          <Input
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
          <Input
            label="Description"
            name="description"
            as="textarea"
            value={form.description}
            onChange={handleChange}
          />

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Image</label>
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
              <p className="text-xs text-gray-400 mt-1">Leave empty to keep the current image.</p>
            )}
          </div>

          <Button type="submit" full loading={saving}>
            {editingId ? "Save Changes" : "Create Restaurant"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Restaurants;
