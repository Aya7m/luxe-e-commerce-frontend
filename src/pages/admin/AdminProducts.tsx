import { useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getProducts } from "../../services/product.service";
import {
  createProductApi,
  deleteProductApi,
  updateProductApi,
  uploadImageApi,
} from "../../services/admin.service";
import type { Product } from "../../types/product";
import Loading from "../../components/Loading";

type ProductForm = {
  name: string;
  description: string;
  brand: string;
  category: string;
  price: string;
  rating: string;
  stock: string;
  image: string;
};

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    brand: "",
    category: "Women",
    price: "",
    rating: "4.5",
    stock: "",
    image: "",
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await getProducts();
      return res.products; // أو res.data.products
    },
  });
  const handleChange = (field: keyof ProductForm, value: string): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = (): void => {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      brand: "",
      category: "Women",
      price: "",
      rating: "4.5",
      stock: "",
      image: "",
    });
  };

  const createMutation = useMutation({
    mutationFn: createProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created");
      resetForm();
    },
    onError: () => toast.error("Failed to create product"),
  });

  const updateMutation = useMutation({
    mutationFn: updateProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated");
      resetForm();
    },
    onError: () => toast.error("Failed to update product"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const uploadMutation = useMutation({
    mutationFn: uploadImageApi,
    onSuccess: (imageUrl) => {
      handleChange("image", imageUrl);
      toast.success("Image uploaded");
    },
    onError: (error) => {
      console.log("UPLOAD ERROR:", error);
      toast.error("Image upload failed");
    },
  });

  const handleSubmit = (): void => {
    if (
      !form.name ||
      !form.description ||
      !form.brand ||
      !form.category ||
      !form.price ||
      !form.stock ||
      !form.image
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const price = Number(form.price);
    const rating = Number(form.rating);
    const stock = Number(form.stock);

    if (Number.isNaN(price) || price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    if (Number.isNaN(stock) || stock < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    if (Number.isNaN(rating) || rating < 0 || rating > 5) {
      toast.error("Rating must be between 0 and 5");
      return;
    }

    const productData = {
      name: form.name,
      description: form.description,
      brand: form.brand,
      category: form.category,
      price,
      rating,
      stock,
      image: form.image,
    };

    if (editingId) {
      updateMutation.mutate({
        productId: editingId,
        product: productData,
      });
    } else {
      createMutation.mutate(productData);
    }
  };

  const handleEdit = (product: Product): void => {
    setEditingId(product._id);

    setForm({
      name: product.name,
      description: product.description,
      brand: product.brand,
      category: product.category,
      price: String(product.price),
      rating: String(product.rating),
      stock: String(product.stock),
      image: product.image,
    });
  };

  if (isLoading) return <Loading />;

  return (
    <section>
      <h1 className="mb-8 text-4xl font-bold">Admin Products</h1>

      <div className="mb-8 grid gap-5 rounded-3xl bg-white p-6 shadow md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">Product Name</label>
          <input
            className="w-full rounded-2xl border p-4"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Brand</label>
          <input
            className="w-full rounded-2xl border p-4"
            value={form.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Price</label>
          <input
            className="w-full rounded-2xl border p-4"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Stock</label>
          <input
            className="w-full rounded-2xl border p-4"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Rating</label>
          <input
            className="w-full rounded-2xl border p-4"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={(e) => handleChange("rating", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Category</label>
          <select
            className="w-full rounded-2xl border p-4"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            <option value="Women">Women</option>
            <option value="Men">Men</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">Product Image</label>
          <input
            className="w-full rounded-2xl border p-4"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadMutation.mutate(file);
            }}
          />
        </div>

        {uploadMutation.isPending && (
          <p className="text-sm text-gray-500 md:col-span-2">
            Uploading image...
          </p>
        )}

        {form.image && (
          <div className="md:col-span-2">
            <img
              src={form.image}
              alt="Preview"
              className="h-32 w-32 rounded-2xl object-cover"
            />
          </div>
        )}

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">Description</label>
          <textarea
            className="w-full rounded-2xl border p-4"
            rows={4}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={
            uploadMutation.isPending ||
            createMutation.isPending ||
            updateMutation.isPending
          }
          className="rounded-full bg-black py-4 text-white disabled:opacity-50 md:col-span-2"
        >
          {editingId
            ? updateMutation.isPending
              ? "Updating..."
              : "Update Product"
            : createMutation.isPending
              ? "Adding..."
              : "Add Product"}
        </button>

        {editingId && (
          <button
            onClick={resetForm}
            className="rounded-full border py-4 md:col-span-2"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <div className="space-y-4">
        {products?.map((product) => (
          <div
            key={product._id}
            className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-20 w-20 rounded-2xl object-cover"
            />

            <div className="flex-1">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-500">
                {product.brand} • {product.category}
              </p>
              <p>${product.price}</p>
            </div>

            <button
              onClick={() => handleEdit(product)}
              className="rounded-full border px-4 py-2"
            >
              Edit
            </button>

            <button
              onClick={() => deleteMutation.mutate(product._id)}
              className="text-red-500"
            >
              <Trash2 />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminProducts;
