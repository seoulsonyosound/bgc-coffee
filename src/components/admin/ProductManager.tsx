"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Edit3,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  PRODUCT_CATEGORIES,
  Product,
  ProductCategory,
} from "@/types/product";
import { PRESET_PRODUCT_IMAGES } from "@/data/products";
import { formatPHP } from "@/lib/utils";
import { resolveAssetUrl } from "@/lib/aws-config";
import { Badge } from "@/components/ui/Badge";

interface ProductFormState {
  name: string;
  description: string;
  category: ProductCategory;
  price: string;
  imageUrl: string;
  available: boolean;
  featured: boolean;
  tastingNotes: string;
}

const EMPTY_FORM: ProductFormState = {
  name: "",
  description: "",
  category: "Espresso-Based",
  price: "100",
  imageUrl: "/images/final-products/Iced-Spanish-Oat-Latte.png",
  available: true,
  featured: false,
  tastingNotes: "",
};

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Toast feedback
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2800);
  };

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    return res.json();
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((data) => {
        if (active) {
          setProducts(Array.isArray(data.products) ? data.products : []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== "All" && p.category !== categoryFilter) {
        return false;
      }
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, search, categoryFilter]);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: String(product.price),
      imageUrl: product.imageUrl,
      available: product.available,
      featured: product.featured,
      tastingNotes: product.tastingNotes || "",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleImageFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5_000_000) {
      setFormError("Please select an image smaller than 5MB.");
      return;
    }

    // Attempt S3 upload via server API first (production AWS mode)
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (typeof data.url === "string") {
          setForm((prev) => ({ ...prev, imageUrl: data.url }));
          setFormError(null);
          return;
        }
      } else if (res.status !== 501) {
        const errData = await res.json().catch(() => ({}));
        setFormError(errData.error || "Failed to upload image.");
        return;
      }
    } catch {
      // Fall through to local prototype FileReader fallback
    }

    // Local prototype fallback when S3_ASSETS_BUCKET is not configured
    if (file.size > 1_500_000) {
      setFormError(
        "Please select an image smaller than 1.5MB for local prototype storage."
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
        setFormError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedPrice = Number(form.price);
    if (!form.name.trim()) {
      setFormError("Product name is required.");
      return;
    }
    if (!form.description.trim()) {
      setFormError("Product description is required.");
      return;
    }
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError("Enter a valid positive price in PHP.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: parsedPrice,
        imageUrl: form.imageUrl.trim() || "/images/products/spanish-latte.jpg",
        available: form.available,
        featured: form.featured,
        tastingNotes: form.tastingNotes.trim() || undefined,
      };

      const url = editingProduct
        ? `/api/products/${encodeURIComponent(editingProduct.id)}`
        : "/api/products";
      const method = editingProduct ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save product.");
      }

      await loadProducts();
      setModalOpen(false);
      showFeedback(
        editingProduct
          ? `Updated "${data.product.name}"`
          : `Added "${data.product.name}" to menu`
      );
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      const res = await fetch(
        `/api/products/${encodeURIComponent(product.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ available: !product.available }),
        }
      );
      if (!res.ok) return;
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, available: !p.available } : p
        )
      );
      showFeedback(
        `${product.name} marked as ${
          !product.available ? "Available" : "Unavailable"
        }`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      const res = await fetch(
        `/api/products/${encodeURIComponent(product.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ featured: !product.featured }),
        }
      );
      if (!res.ok) return;
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, featured: !p.featured } : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}" from the BGC Coffee menu?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/products/${encodeURIComponent(product.id)}`,
        { method: "DELETE" }
      );
      if (!res.ok) return;
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      showFeedback(`Deleted "${product.name}"`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 border-b border-[#171717] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#795548]">
            Catalog CRUD
          </p>
          <h1 className="mt-1 font-editorial text-3xl text-[#171717] sm:text-4xl">
            Product Management
          </h1>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 border border-[#171717] bg-[#171717] px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-white vintage-shadow-sm hover:bg-[#795548] hover:border-[#795548] transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          role="status"
          className="flex items-center gap-2 border border-[#171717] bg-[#E8DED2] px-4 py-3 font-display text-xs font-bold uppercase tracking-[0.12em] text-[#3B2923]"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {feedback}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 border border-[#171717] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#171717]/45" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or ID..."
            className="w-full border border-[#171717] bg-[#F7F4EE]/50 py-2 pl-9 pr-3 text-sm focus:border-[#795548] focus:bg-white focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
          className="border border-[#171717] bg-white px-3.5 py-2 font-display text-xs font-semibold uppercase tracking-wider text-[#171717] focus:border-[#795548] focus:outline-none"
        >
          <option value="All">All Categories</option>
          {PRODUCT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden border border-[#171717] bg-white">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-14 animate-pulse bg-[#F7F4EE]" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#171717]/60">
            No products found matching your filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#171717] bg-[#F7F4EE] font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[#171717]/75">
                <tr>
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Price</th>
                  <th className="px-4 py-3.5">Availability</th>
                  <th className="px-4 py-3.5">Featured</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D9D9]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#F7F4EE]/60">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3.5">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-[#171717] bg-[#E8DED2]">
                          <Image
                            src={resolveAssetUrl(product.imageUrl)}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="font-semibold text-[#171717] truncate">
                              {product.name}
                            </p>
                            {product.badges?.map((badge) => (
                              <Badge
                                key={badge}
                                variant={
                                  badge === "Best Seller" ? "dark" : "brown"
                                }
                                className="text-[9px] px-1.5 py-0"
                              >
                                {badge}
                              </Badge>
                            ))}
                          </div>
                          <p className="font-mono text-[11px] text-[#171717]/50">
                            {product.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant="brown">{product.category}</Badge>
                    </td>
                    <td className="px-4 py-3.5 font-display font-bold text-[#171717]">
                      {formatPHP(product.price)}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(product)}
                        className="cursor-pointer"
                        title="Click to toggle availability"
                      >
                        <Badge
                          variant={product.available ? "success" : "danger"}
                        >
                          {product.available ? "Available" : "Unavailable"}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(product)}
                        aria-label={`Toggle featured status for ${product.name}`}
                        className={`inline-flex items-center gap-1 border px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          product.featured
                            ? "border-[#171717] bg-[#171717] text-[#F7F4EE]"
                            : "border-[#D9D9D9] bg-[#F7F4EE] text-[#171717]/60 hover:border-[#171717] hover:text-[#171717]"
                        }`}
                      >
                        <Star
                          className={`h-3.5 w-3.5 ${
                            product.featured
                              ? "fill-[#E8DED2] text-[#E8DED2]"
                              : ""
                          }`}
                        />
                        {product.featured ? "Yes" : "No"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="border border-[#171717]/30 bg-white p-2 text-[#171717] hover:border-[#171717] hover:bg-[#E8DED2] cursor-pointer"
                          title="Edit product"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          className="border border-[#171717]/30 bg-white p-2 text-[#3B2923] hover:border-[#171717] hover:bg-[#171717] hover:text-white cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/65 p-4 overflow-y-auto"
        >
          <div className="w-full max-w-2xl border border-[#171717] bg-white p-6 sm:p-8 vintage-shadow max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#171717] pb-4">
              <h2 className="font-editorial text-2xl text-[#171717]">
                {editingProduct
                  ? "Edit Coffee Product"
                  : "Add New Coffee Product"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
                className="border border-[#171717]/25 p-1.5 text-[#171717] hover:bg-[#E8DED2]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 border border-[#171717] bg-[#E8DED2] px-4 py-3 text-xs font-medium text-[#3B2923]">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-5 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#171717]">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Sea Salt Latte"
                    className="mt-1.5 w-full border border-[#171717] bg-[#F7F4EE]/50 px-3.5 py-2.5 text-sm focus:border-[#795548] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#171717]">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className="mt-1.5 w-full border border-[#171717] bg-white px-3.5 py-2.5 text-sm focus:border-[#795548] focus:outline-none"
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#171717]">
                    Base Price (PHP ₱) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="mt-1.5 w-full border border-[#171717] bg-[#F7F4EE]/50 px-3.5 py-2.5 text-sm focus:border-[#795548] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#171717]">
                    Tasting Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.tastingNotes}
                    onChange={(e) =>
                      setForm({ ...form, tastingNotes: e.target.value })
                    }
                    placeholder="e.g., Sweet cream, cocoa"
                    className="mt-1.5 w-full border border-[#171717] bg-[#F7F4EE]/50 px-3.5 py-2.5 text-sm focus:border-[#795548] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#171717]">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe the espresso, milk, flavor profile..."
                  className="mt-1.5 w-full border border-[#171717] bg-[#F7F4EE]/50 px-3.5 py-2.5 text-sm focus:border-[#795548] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Image Selection / Upload */}
              <div className="border border-[#171717] bg-[#F7F4EE] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#171717]">
                    Product Image (Local / Future S3 Reference)
                  </label>
                  <label className="inline-flex items-center gap-1.5 border border-[#171717] bg-white px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-wider text-[#171717] hover:bg-[#E8DED2] cursor-pointer">
                    <Upload className="h-3.5 w-3.5 text-[#795548]" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-[#171717] bg-white">
                    <Image
                      src={resolveAssetUrl(form.imageUrl)}
                      alt="Preview"
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <select
                      value={
                        PRESET_PRODUCT_IMAGES.some(
                          (img) => img.url === form.imageUrl
                        )
                          ? form.imageUrl
                          : ""
                      }
                      onChange={(e) => {
                        if (e.target.value) {
                          setForm({ ...form, imageUrl: e.target.value });
                        }
                      }}
                      className="w-full border border-[#171717] bg-white px-3 py-2 text-xs text-[#171717]"
                    >
                      <option value="">
                        Select a preset BGC product photo...
                      </option>
                      {PRESET_PRODUCT_IMAGES.map((img) => (
                        <option key={img.url} value={img.url}>
                          {img.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={form.imageUrl}
                      onChange={(e) =>
                        setForm({ ...form, imageUrl: e.target.value })
                      }
                      placeholder="/images/products/spanish-latte.jpg or S3 URL"
                      className="w-full border border-[#171717]/40 bg-white px-3 py-1.5 text-xs text-[#171717]"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-[#171717] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) =>
                      setForm({ ...form, available: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#795548]"
                  />
                  Available on Menu
                </label>

                <label className="inline-flex items-center gap-2 text-sm font-medium text-[#171717] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#795548]"
                  />
                  Feature on Homepage
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#D9D9D9] pt-5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="border border-[#171717] bg-white px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-[#171717] hover:bg-[#F7F4EE] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 border border-[#171717] bg-[#171717] px-6 py-2.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-[#795548] hover:border-[#795548] disabled:opacity-60 cursor-pointer"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
