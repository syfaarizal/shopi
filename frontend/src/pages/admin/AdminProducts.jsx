import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, X, Tag } from "lucide-react";
import { useProductStore } from "../../store/productStore";
import { CATEGORIES } from "../../data/products";
import { formatPrice } from "../../utils/format";
import ImageUpload from "../../components/ImageUpload";

const EMPTY_FORM = {
  name: "", category: "electronics", brand: "", price: "",
  originalPrice: "", discount: "", stock: "",
  description: "", images: [], isFlashSale: false,
};

export default function AdminProducts() {
  const allProducts = useProductStore((s) => s.getAllProducts());
  const addProduct  = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);

  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(null); // null | "add" | "edit"
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving]     = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allProducts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }, [allProducts, search]);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setModal("add");
  }

  function openEdit(product) {
    setForm({
      name:          product.name,
      category:      product.category,
      brand:         product.brand,
      price:         String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      discount:      product.discount ? String(product.discount) : "",
      stock:         String(product.stock),
      description:   product.description || "",
      images:        product.images || [],
      isFlashSale:   product.isFlashSale || false,
    });
    setEditId(product.id);
    setModal("edit");
  }

  async function handleSave() {
    if (!form.name || !form.brand || !form.price) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));

    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      discount: form.discount ? Number(form.discount) : null,
      stock: Number(form.stock) || 0,
    };

    if (modal === "add") {
      addProduct(payload);
    } else {
      updateProduct(editId, payload);
    }
    setSaving(false);
    setModal(null);
  }

  function handleDelete(id) {
    deleteProduct(id);
    setDeleteConfirm(null);
  }

  function setImage(url) {
    setForm((f) => ({ ...f, images: url ? [url, ...f.images.slice(1)] : f.images.slice(1) }));
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-ink dark:text-dark-ink">Products</h1>
          <p className="text-sm text-muted">{allProducts.length} total products</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white text-sm font-semibold rounded-xl px-5 py-2.5 hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-xl px-4 overflow-hidden shadow-card">
        <Search size={16} className="text-muted shrink-0" />
        <input
          type="text" placeholder="Search by name or brand..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full py-3 text-sm bg-transparent text-ink dark:text-dark-ink outline-none placeholder:text-muted"
        />
      </div>

      {/* Table */}
      <div className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border dark:border-dark-border text-xs text-muted uppercase tracking-wide bg-bg dark:bg-dark-bg">
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3 text-center">Sale</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-dark-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-bg dark:hover:bg-dark-bg transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=60"}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-border dark:border-dark-border"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-ink dark:text-dark-ink line-clamp-1">{p.name}</p>
                        <p className="text-xs text-muted">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-bg dark:bg-dark-bg text-muted px-2.5 py-1 rounded-full capitalize">
                      {CATEGORIES.find((c) => c.id === p.category)?.name || p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="font-semibold text-ink dark:text-dark-ink">{formatPrice(p.price)}</p>
                    {p.originalPrice && (
                      <p className="text-xs text-muted line-through">{formatPrice(p.originalPrice)}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-xs font-semibold ${p.stock < 10 ? "text-primary" : "text-ink dark:text-dark-ink"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.isFlashSale ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        <Tag size={10} /> Sale
                      </span>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="w-8 h-8 rounded-lg border border-border dark:border-dark-border text-muted hover:text-primary hover:border-primary flex items-center justify-center transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(p.id)}
                        className="w-8 h-8 rounded-lg border border-border dark:border-dark-border text-muted hover:text-primary hover:border-primary flex items-center justify-center transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal(null)} />
          <div className="relative w-full max-w-2xl bg-surface dark:bg-dark-surface rounded-2xl shadow-premium max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-dark-border sticky top-0 bg-surface dark:bg-dark-surface rounded-t-2xl">
              <h2 className="text-lg font-bold text-ink dark:text-dark-ink">
                {modal === "add" ? "Add New Product" : "Edit Product"}
              </h2>
              <button onClick={() => setModal(null)} className="text-muted hover:text-primary">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image upload */}
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 block">Product Image</label>
                <ImageUpload
                  value={form.images?.[0] || ""}
                  onChange={setImage}
                />
              </div>

              {/* Name */}
              <Field label="Product Name *">
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Wireless Headphones Pro"
                  className={INPUT}
                />
              </Field>

              {/* Brand + Category */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Brand *">
                  <input
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                    placeholder="e.g. Sony"
                    className={INPUT}
                  />
                </Field>
                <Field label="Category">
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className={INPUT + " cursor-pointer"}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-3 gap-4">
                <Field label="Price (Rp) *">
                  <input type="number" value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="0" className={INPUT} />
                </Field>
                <Field label="Original Price">
                  <input type="number" value={form.originalPrice}
                    onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))}
                    placeholder="0" className={INPUT} />
                </Field>
                <Field label="Discount (%)">
                  <input type="number" value={form.discount}
                    onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))}
                    placeholder="0" className={INPUT} />
                </Field>
              </div>

              {/* Stock */}
              <Field label="Stock">
                <input type="number" value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  placeholder="0" className={INPUT} />
              </Field>

              {/* Description */}
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the product..."
                  rows={3}
                  className={INPUT + " resize-none"}
                />
              </Field>

              {/* Flash sale toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm((f) => ({ ...f, isFlashSale: !f.isFlashSale }))}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${form.isFlashSale ? "bg-primary" : "bg-border dark:bg-dark-border"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${form.isFlashSale ? "translate-x-5" : "translate-x-0"}`} />
                </div>
                <span className="text-sm font-medium text-ink dark:text-dark-ink">Include in Flash Sale</span>
              </label>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setModal(null)} className="flex-1 border border-border dark:border-dark-border text-ink dark:text-dark-ink font-semibold rounded-xl py-3 hover:border-primary hover:text-primary transition-colors text-sm">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.brand || !form.price}
                className="flex-1 bg-primary text-white font-semibold rounded-xl py-3 hover:bg-primary-dark transition-colors text-sm disabled:opacity-50"
              >
                {saving ? "Saving..." : modal === "add" ? "Add Product" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-surface dark:bg-dark-surface rounded-2xl shadow-premium p-6 max-w-sm w-full animate-scaleIn text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-ink dark:text-dark-ink mb-2">Delete Product?</h3>
            <p className="text-sm text-muted mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-border dark:border-dark-border rounded-xl py-2.5 text-sm font-semibold text-ink dark:text-dark-ink hover:border-primary hover:text-primary transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-primary text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-primary-dark transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const INPUT = "w-full border border-border dark:border-dark-border rounded-xl px-4 py-2.5 text-sm bg-bg dark:bg-dark-bg text-ink dark:text-dark-ink outline-none focus:border-primary transition-colors";

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
