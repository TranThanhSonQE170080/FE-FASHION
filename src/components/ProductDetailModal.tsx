import { X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext"; // ✅ Import hàm thêm giỏ hàng

interface Props {
  product: any;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: Props) {
  const { addToCart } = useCart(); // ✅ Lấy hàm addToCart ra dùng

  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // ✅ Hàm xử lý khi bấm nút Thêm vào giỏ
  const handleAddToCart = () => {
    addToCart(product, 1);
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    onClose(); // Đóng bảng sau khi mua
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
      <div className="bg-white rounded-2xl w-full max-w-4xl relative animate-in fade-in zoom-in overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-600 hover:text-black hover:bg-gray-100 transition-all shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full md:w-1/2 bg-gray-50 flex-shrink-0">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-64 md:h-full object-cover object-center"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
              {product.name}
            </h2>
            <p className="text-3xl font-extrabold text-[#FF6B6B]">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="mb-8 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
              Thông tin sản phẩm
            </h3>
            <div className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100 space-y-5">
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 gap-2">
              <span className="flex items-center">
                Tình trạng: 
                <span className={`ml-2 px-2 py-1 rounded-md font-semibold text-xs ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}
                </span>
              </span>
              {product.category && (
                <span className="bg-gray-100 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider">
                  {product.category}
                </span>
              )}
            </div>

            {/* ✅ Nút Thêm vào giỏ đã được gắn sự kiện */}
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-black hover:bg-[#FF6B6B] text-white py-6 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Tạm hết hàng'}
            </Button>
          </div>
        </div>
        
      </div>
    </div>
  );
}