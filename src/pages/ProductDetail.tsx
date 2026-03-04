import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { Loader2, ArrowLeft, ShoppingCart, Truck, Shield, RefreshCw } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  size: string;
  color: string;
  stock: number;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Gọi API lấy thông tin chi tiết của 1 sản phẩm theo ID
        const res = await fetch(`${API_URL}/api/v1/entities/products/${id}`);
        if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
        
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image || 'https://via.placeholder.com/150',
      }, quantity);
      
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#FF6B6B]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm!</h1>
          <p className="text-gray-500 mb-8">Sản phẩm này có thể đã bị xóa hoặc không tồn tại.</p>
          <Button onClick={() => navigate('/')} className="bg-black text-white hover:bg-[#FF6B6B]">
            Quay lại trang chủ
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center text-gray-600 hover:text-[#FF6B6B] mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quay lại
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Khu vực Hình ảnh */}
          <div className="relative aspect-[3/4] md:aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <img 
              src={product.image || 'https://via.placeholder.com/600'} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600?text=No+Image';
              }}
            />
            {isOutOfStock && (
              <Badge className="absolute top-4 left-4 text-sm px-3 py-1 bg-gray-900 text-white">
                Hết hàng
              </Badge>
            )}
          </div>

          {/* Khu vực Thông tin */}
          <div className="flex flex-col">
            <div className="mb-2">
              <Badge variant="outline" className="text-gray-600 border-gray-300">
                {product.category.toUpperCase()}
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="text-3xl font-bold text-[#FF6B6B] mb-6">
              {formatPrice(product.price)}
            </div>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            {/* Thuộc tính sản phẩm (Size & Màu) */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {product.size && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="block text-sm text-gray-500 mb-1">Kích cỡ (Size)</span>
                  <span className="font-semibold text-gray-900">{product.size}</span>
                </div>
              )}
              {product.color && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="block text-sm text-gray-500 mb-1">Màu sắc</span>
                  <span className="font-semibold text-gray-900">{product.color}</span>
                </div>
              )}
            </div>

            {/* Chọn số lượng & Thêm vào giỏ */}
            <div className="flex items-end gap-4 mb-10 pt-8 border-t border-gray-100">
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng (Kho: {product.stock})
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-12">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-200 text-gray-600 transition-colors"
                    disabled={isOutOfStock}
                  >-</button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val > 0 && val <= product.stock) setQuantity(val);
                    }}
                    className="flex-1 w-full h-full text-center border-none focus:ring-0 font-medium"
                    disabled={isOutOfStock}
                  />
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-200 text-gray-600 transition-colors"
                    disabled={isOutOfStock}
                  >+</button>
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 h-12 bg-black hover:bg-[#FF6B6B] text-white text-lg font-semibold rounded-lg shadow-lg transition-all"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
              </Button>
            </div>

            {/* Thông tin Cam kết */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-center">
                <Truck className="w-6 h-6 text-gray-700 mb-2" />
                <span className="text-sm font-medium text-gray-900">Giao hàng toàn quốc</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-center">
                <Shield className="w-6 h-6 text-gray-700 mb-2" />
                <span className="text-sm font-medium text-gray-900">Cam kết chính hãng</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-center">
                <RefreshCw className="w-6 h-6 text-gray-700 mb-2" />
                <span className="text-sm font-medium text-gray-900">Đổi trả trong 7 ngày</span>
              </div>
            </div>
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}