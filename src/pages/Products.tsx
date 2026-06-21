import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import ProductCard from "../components/product/ProductCard";
import { getProducts } from "../services/product.service";
import Loading from "../components/Loading";

export default function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["products", search, category, maxPrice, minRating, sort, page],
    queryFn: () =>
      getProducts({
        search,
        category,
        maxPrice,
        rating: minRating,
        sort,
        page,
        limit: 6,
      }),
    placeholderData: keepPreviousData,
  });

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;
  const totalProducts = data?.totalProducts || 0;

  if (isLoading && !data) {
    return <Loading/>
  }

  if (isError) {
    return <div className="py-20 text-center">Failed to load products.</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] px-6 pt-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.35em] text-neutral-500">
              Shop Collection
            </p>
            <h1 className="text-4xl font-semibold md:text-6xl">
              Discover Products
            </h1>
          </div>

          <div className="flex items-center gap-2 text-neutral-600">
            <SlidersHorizontal size={20} />
            <span>{totalProducts} products found</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">Filters</h2>

            <div className="space-y-5">
              <div className="flex items-center gap-3 rounded-2xl bg-neutral-100 px-4">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-transparent py-4 outline-none"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <select
                className="w-full rounded-2xl bg-neutral-100 px-4 py-4 outline-none"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">All Categories</option>
                <option value="Women">Women</option>
                <option value="Men">Men</option>
                <option value="Accessories">Accessories</option>
              </select>

              <select
                className="w-full rounded-2xl bg-neutral-100 px-4 py-4 outline-none"
                value={minRating}
                onChange={(e) => {
                  setMinRating(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={0}>All Ratings</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.8}>4.8+ Stars</option>
              </select>

              <div className="rounded-2xl bg-neutral-100 px-4 py-3">
                <p className="mb-2 text-sm text-gray-500">
                  Max Price: ${maxPrice}
                </p>

                <input
                  type="range"
                  min="0"
                  max="500"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-full"
                />
              </div>

              <select
                className="w-full rounded-2xl bg-neutral-100 px-4 py-4 outline-none"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="default">Default</option>
                <option value="newest">Newest</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setMaxPrice(500);
                  setMinRating(0);
                  setSort("default");
                  setPage(1);
                }}
                className="w-full rounded-full border py-3 font-medium"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          <div>
            {isFetching && (
              <p className="mb-4 text-sm text-neutral-500">
                Updating products...
              </p>
            )}

            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {products.length === 0 && (
              <div className="rounded-3xl bg-white py-20 text-center text-neutral-500">
                No products found.
              </div>
            )}

            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="rounded-lg border px-4 py-2 disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`rounded-lg px-4 py-2 ${
                    page === i + 1 ? "bg-black text-white" : "border"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="rounded-lg border px-4 py-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
