import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  product: any;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: Props) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-6 relative animate-in fade-in zoom-in">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="rounded-xl overflow-hidden bg-gray-100">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <p className="text-3xl font-bold text-[#FF6B6B] mb-6">
              ${product.price}
            </p>

            <p className="text-sm text-gray-500 mb-6">
              Stock: {product.stock}
            </p>

            <Button className="w-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
