import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import PaginationControl from '@/components/ProductPagination';
import { Button } from '@/components/ui/button';
import ProductDetailModal from '@/components/ProductDetailModal';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  created_at: string;
}

const normalizeProduct = (raw: any): Product => ({
  id: raw.id,
  name: raw.name ?? 'Unnamed product',
  description: raw.description ?? '',
  price: typeof raw.price === 'number' ? raw.price : 0,
  category: raw.category ?? 'Uncategorized',
  image_url:
    raw.image_url ||
    raw.image ||
    'https://via.placeholder.com/400x600?text=No+Image',
  stock: typeof raw.stock === 'number' ? raw.stock : 0,
  created_at: raw.created_at ?? '',
});

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ MODAL STATE
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const categories = [
    'All',
    'T-Shirts',
    'Jeans',
    'Jackets',
    'Dresses',
    'Hoodies',
    'Sweaters',
    'Pants',
    'Uncategorized',
  ];

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        'http://localhost:8000/api/v1/entities/products?limit=1000'
      );
      if (!res.ok) throw new Error('Fetch failed');

      const data = await res.json();
      const normalized = (data.items || []).map(normalizeProduct);

      normalized.sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );

      setProducts(normalized);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */
  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, selectedCategory, priceRange, searchQuery, sortBy]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearchQuery} />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold">All Products</h2>
            <Button onClick={fetchProducts}>🔄 Refresh</Button>
          </div>

          <div className="flex gap-8">
            <aside className="w-64">
              <FilterSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                priceRange={priceRange}
                onPriceRangeChange={(r) =>
                  setPriceRange([r[0], r[1]])
                }
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </aside>

            <div className="flex-1">
              {loading ? (
                <p>Loading...</p>
              ) : currentProducts.length === 0 ? (
                <p className="text-center text-gray-500">
                  No products found
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        {...p}
                        onClick={() => setSelectedProduct(p)} // ✅ MỞ MODAL
                      />
                    ))}
                  </div>

                  <PaginationControl
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ MODAL */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <Footer />
    </div>
  );
}
