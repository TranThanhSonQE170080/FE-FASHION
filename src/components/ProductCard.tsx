import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
  stock?: number;
  onClick?: () => void;
}

export default function ProductCard({
  id,
  name,
  price,
  image_url,
  category,
  stock = 0,
  onClick,
}: ProductCardProps) {
  const isLowStock = stock < 20 && stock > 0;
  const isOutOfStock = stock === 0;

  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    addToCart({ id, name, price, image_url }, 1);
    alert(`Đã thêm ${name} vào giỏ hàng!`);
  };

  // ✅ HÀM FORMAT GIÁ TIỀN CHUẨN VIỆT NAM (VNĐ)
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={image_url || 'https://via.placeholder.com/400x600?text=No+Image'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600?text=No+Image';
          }}
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

        {isOutOfStock && (
          <Badge className="absolute top-3 left-3 bg-gray-800 text-white">
            Hết hàng
          </Badge>
        )}

        {isLowStock && (
          <Badge className="absolute top-3 left-3 bg-[#FF6B6B] text-white">
            Sắp hết
          </Badge>
        )}

        <Badge className="absolute top-3 right-3 bg-white/90 text-gray-800 backdrop-blur-sm">
          {category === 'men' ? 'Nam' : category === 'women' ? 'Nữ' : category}
        </Badge>

        {/* Favorite Button */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white hover:bg-[#FF6B6B] hover:text-white shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-[#FF6B6B] transition-colors">
            {name}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            {/* ✅ HIỂN THỊ GIÁ TIỀN ĐÃ FORMAT */}
            <span className="text-xl font-bold text-[#FF6B6B]">
              {formatPrice(price)}
            </span>
            {stock > 0 && (
              <span className="block text-xs text-gray-500 mt-1">
                Kho: {stock}
              </span>
            )}
          </div>

          <Button
            size="sm"
            disabled={isOutOfStock}
            className="bg-black hover:bg-[#FF6B6B] text-white rounded-full px-4 transition-all duration-300 flex-shrink-0 ml-2"
            onClick={handleAddToCart} 
          >
            <ShoppingCart className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Thêm</span>
          </Button>
        </div>
      </div>
    </div>
  );
}