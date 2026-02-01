import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
  stock?: number;
  onClick?: () => void; // ✅ thêm
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

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={image_url}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

        {isOutOfStock && (
          <Badge className="absolute top-3 left-3 bg-gray-800 text-white">
            Out of Stock
          </Badge>
        )}

        {isLowStock && (
          <Badge className="absolute top-3 left-3 bg-[#FF6B6B] text-white">
            Low Stock
          </Badge>
        )}

        <Badge className="absolute top-3 right-3 bg-white/90 text-gray-800 backdrop-blur-sm">
          {category}
        </Badge>

        {/* ❤️ Favorite */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white hover:bg-[#FF6B6B] hover:text-white shadow-lg"
            onClick={(e) => {
              e.stopPropagation(); // ❗ không mở popup
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#FF6B6B] transition-colors">
          {name}
        </h3>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {stock > 0 && (
              <span className="block text-xs text-gray-500 mt-1">
                {stock} in stock
              </span>
            )}
          </div>

          <Button
            size="sm"
            disabled={isOutOfStock}
            className="bg-black hover:bg-[#FF6B6B] text-white rounded-full px-4 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation(); // ❗ không mở popup
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
