import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="w-8 h-8 text-[#FF6B6B]" />
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center flex flex-col items-center">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" 
              alt="Empty Cart" 
              className="w-40 h-40 mb-6 opacity-50"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Giỏ hàng đang trống</h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy quay lại trang cửa hàng để tiếp tục mua sắm nhé!
            </p>
            <Link to="/">
              <Button className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white px-8 py-6 rounded-full text-lg">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Danh sách sản phẩm */}
            <div className="flex-1 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{item.name}</h3>
                    <p className="text-[#FF6B6B] font-bold mt-1">{formatPrice(item.price)}</p>
                  </div>
                  
                  {/* Tăng giảm số lượng */}
                  <div className="flex items-center border border-gray-200 rounded-full bg-gray-50 p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-10 text-center font-semibold text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Cột Tổng tiền của item & Nút xóa */}
                  <div className="w-32 text-right flex flex-col items-end gap-2">
                    <p className="font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bảng tóm tắt đơn hàng */}
            <div className="w-full lg:w-96">
              <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">Tóm tắt đơn hàng</h2>
                
                <div className="space-y-4 text-gray-600 mb-6">
                  <div className="flex justify-between">
                    <span>Tạm tính ({cart.length} sản phẩm)</span>
                    <span className="font-medium text-gray-900">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí giao hàng</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                    <span className="text-2xl font-extrabold text-[#FF6B6B]">{formatPrice(cartTotal)}</span>
                  </div>
                  <p className="text-xs text-gray-500 text-right mt-1">(Đã bao gồm VAT)</p>
                </div>

                <Link to="/checkout">
                  <Button className="w-full bg-black hover:bg-[#FF6B6B] text-white py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                    Tiến hành Thanh toán
                  </Button>
                </Link>
                
                <Link to="/">
                  <Button variant="ghost" className="w-full mt-3 text-gray-500 hover:text-black">
                    Tiếp tục mua sắm
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}