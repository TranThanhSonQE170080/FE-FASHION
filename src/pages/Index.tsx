import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import PaginationControl from '@/components/ProductPagination';
import { Button } from '@/components/ui/button';
import ProductDetailModal from '@/components/ProductDetailModal';
import { ChevronRight, TrendingUp, Sparkles } from 'lucide-react';

// ✅ Gắn cứng API để trị triệt để lỗi "Config loading" (Không dùng config.ts nữa)
const API_URL = 'https://prn232-fashion.onrender.com';

/* =======================
   1️⃣ KIỂU DỮ LIỆU & CHUẨN HÓA
======================= */
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
  /* =======================
     2️⃣ KHAI BÁO STATE
  ======================= */
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // ✅ Cập nhật danh sách Categories cho khớp với Admin
  const categories = [
    'All', 'men', 'women', 'accessories', 'T-Shirts', 'Jeans', 'Jackets', 'Dresses', 'Hoodies', 'Sweaters'
  ];

  /* =======================
     3️⃣ FETCH & FILTER LOGIC
  ======================= */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // ✅ Gọi trực tiếp đến Backend thay vì dùng config
      const res = await fetch(`${API_URL}/api/v1/entities/products?limit=1000`);
      if (!res.ok) throw new Error('Fetch failed');

      const data = await res.json();
      const normalized = (data.items || []).map(normalizeProduct);

      normalized.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setProducts(normalized);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ "BỘ NÃO" LỌC SẢN PHẨM Ở ĐÂY
  useEffect(() => {
    let result = [...products];

    // Lọc theo danh mục
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Lọc theo giá
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Lọc theo tên/mô tả
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sắp xếp
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);

    setFilteredProducts(result);
    setCurrentPage(1); // Reset về trang 1 khi đổi bộ lọc
  }, [products, selectedCategory, priceRange, searchQuery, sortBy]);

  /* =======================
     4️⃣ PAGINATION & HELPERS
  ======================= */
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const featuredCategories = [
    {
      name: 'T-Shirts',
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/656699/2026-01-26/2912ca3d-3e5b-4643-918a-308d63eef3e2.png',
      count: products.filter((p) => p.category === 'T-Shirts').length,
    },
    {
      name: 'Jeans',
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/656699/2026-01-26/93bdccd6-9ba0-45e9-9b1f-9b3c403781b0.png',
      count: products.filter((p) => p.category === 'Jeans').length,
    },
    {
      name: 'Jackets',
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/656699/2026-01-26/f2346f83-5e9f-498e-9752-900fd0e40e49.png',
      count: products.filter((p) => p.category === 'Jackets').length,
    },
    {
      name: 'Dresses',
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/656699/2026-01-26/36cf80cd-0d6b-42af-b52f-f7b49a0d8728.png',
      count: products.filter((p) => p.category === 'Dresses').length,
    },
  ];

  /* =======================
     5️⃣ GIAO DIỆN (UI)
  ======================= */
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearchQuery} />

      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://mgx-backend-cdn.metadl.com/generate/images/656699/2026-01-26/a7e70640-9071-490f-a9c4-b14fdcfe046a.png')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-[#FF6B6B]" />
              <span className="text-sm font-semibold tracking-wider uppercase text-[#FF6B6B]">
                New Collection
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Your
              <br />
              <span className="text-[#FF6B6B]">Perfect Style</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Explore our curated collection of premium fashion pieces designed for the modern individual.
            </p>
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={() => handleCategoryClick('All')}
                className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Shop Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleCategoryClick('All')}
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg rounded-full transition-all duration-300 bg-transparent"
              >
                View Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-left"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-300">{category.count} Products</p>
                  <div className="mt-4 inline-flex items-center text-sm font-semibold text-[#FF6B6B] group-hover:gap-2 transition-all">
                    Shop Now
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16 bg-gradient-to-r from-[#FF6B6B] to-[#FF5252]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-white">
            <div className="mb-6 md:mb-0">
              <h2 className="text-4xl font-bold mb-2">Limited Time Offer</h2>
              <p className="text-xl">Get up to 50% off on selected items</p>
            </div>
            <Button
              size="lg"
              onClick={() => handleCategoryClick('All')}
              className="bg-white text-[#FF6B6B] hover:bg-gray-100 px-8 py-6 text-lg rounded-full font-semibold shadow-lg"
            >
              Shop Sale
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products-section" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-[#FF6B6B]" />
                <span className="text-sm font-semibold tracking-wider uppercase text-[#FF6B6B]">
                  Trending Now
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">All Products</h2>
            </div>
            <div className="flex gap-4 items-center">
              <p className="text-gray-600 hidden sm:block">
                {filteredProducts.length > 0 ? (
                  <>Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length}</>
                ) : (
                  'No products'
                )}
              </p>
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#FF5252] transition-colors"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filter */}
            <aside className="lg:w-64 flex-shrink-0">
              <FilterSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                priceRange={priceRange}
                onPriceRangeChange={(r: any) => setPriceRange([r[0], r[1]])}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                      <div className="aspect-[3/4] bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-6 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : currentProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                  <Button
                    onClick={() => {
                      setSelectedCategory('All');
                      setPriceRange([0, 2000000]);
                      setSortBy('newest');
                      setSearchQuery('');
                    }}
                    className="mt-4 bg-[#FF6B6B] hover:bg-[#FF5252] text-white"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        {...p}
                        onClick={() => setSelectedProduct(p)} 
                      />
                    ))}
                  </div>

                  <div className="mt-8">
                    <PaginationControl
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal Detail */}
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