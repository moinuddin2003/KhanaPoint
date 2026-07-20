import { useEffect, useState } from "react";
import { categoriesApi } from "../../services/adminApi";
import Loader from "../../Components/common/Loader";
import Modal from "../../Components/common/Modal";
import Button from "../../Components/common/Button";
import Input from "../../Components/common/Input";
import { Plus, Pencil, Trash2 } from "lucide-react";

const asList = (res) => res?.data || res?.results || (Array.isArray(res) ? res : []);

const EMPTY_FORM = { name: "" };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = creating new
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoriesApi.getAll();
      setCategories(asList(res));
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingId(category.id);
    setForm({ name: category.name || "" });
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
        await categoriesApi.update(editingId, form);
      } else {
        await categoriesApi.create(form);
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(err.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    if (!confirm(`Delete category "${category.name}"? This can't be undone.`)) return;
    try {
      await categoriesApi.remove(category.id);
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
    } catch (err) {
      alert(err.message || "Failed to delete category");
    }
  };

  if (loading) return <Loader fullPage label="Loading categories..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} categories</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={16} /> Add Category
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center py-10">
            No categories yet. Click "Add Category" to create one.
          </p>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between"
            >
              <span className="font-semibold text-brand-dark truncate">{category.name}</span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEditModal(category)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-orange hover:bg-brand-orange/10 transition-colors cursor-pointer"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Category Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Pizza"
            required
          />
          <Button type="submit" full loading={saving}>
            {editingId ? "Save Changes" : "Create Category"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
