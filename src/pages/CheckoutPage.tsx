import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Truck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext'; // ✅ 1. Import useAuth

const API_URL = 'http://127.0.0.1:8000'; // ✅ 2. Thêm URL của Backend

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { token, user } = useAuth(); // ✅ 3. Lấy thông tin user và token
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Tự động điền tên nếu user đã có thông tin
  const [formData, setFormData] = useState({
    fullName: user?.name || user?.email?.split('@')[0] || '', 
    phone: '',
    address: '',
    note: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (cart.length === 0 && !isSuccess) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // ✅ 4. Kiểm tra người dùng đã đăng nhập chưa
    if (!token) {
      alert("Bạn cần đăng nhập để tiến hành đặt hàng!");
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ 5. Chuẩn bị dữ liệu gửi cho FastAPI
      const orderData = {
        customer_name: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        note: formData.note,
        total_amount: cartTotal,
        products: cart.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image_url
        }))
      };

      // ✅ 6. GỌI API THẬT
      const res = await fetch(`${API_URL}/api/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Truyền thẻ căn cước (Token)
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Có lỗi xảy ra khi đặt hàng từ Server!');
      }

      // Đặt hàng thành công
      setIsSuccess(true);
      clearCart();
      
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-lg w-full text-center animate-in fade-in zoom-in duration-500">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Đặt hàng thành công!</h1>
            <p className="text-gray-600 mb-8">
              Cảm ơn bạn <strong>{formData.fullName}</strong> đã mua sắm tại FashionHub. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến địa chỉ: <br/>
              <span className="font-semibold text-gray-800">{formData.address}</span>
            </p>
            <p className="text-sm text-gray-400 mb-6">Tự động quay về trang chủ sau 3 giây...</p>
            <Link to="/">
              <Button className="bg-black text-white hover:bg-[#FF6B6B] rounded-full px-8 py-6">
                Tiếp tục mua sắm ngay
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <Link to="/cart" className="inline-flex items-center text-gray-600 hover:text-[#FF6B6B] mb-8 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quay lại giỏ hàng
        </Link>

        {/* ✅ Bảng hiện lỗi nếu API báo lỗi */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center font-medium">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-white p-6 md:p-8 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b">
              <Truck className="w-6 h-6 text-[#FF6B6B]" />
              <h2 className="text-2xl font-bold text-gray-900">Thông tin giao hàng</h2>
            </div>

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên *</Label>
                  <Input 
                    id="fullName" 
                    required 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="VD: Nguyễn Văn A" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="VD: 0912345678" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ giao hàng chi tiết *</Label>
                <Input 
                  id="address" 
                  required 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Ghi chú đơn hàng (Tùy chọn)</Label>
                <Input 
                  id="note" 
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                  placeholder="Giao vào giờ hành chính, Gọi trước khi giao..." 
                />
              </div>
            </form>
          </div>

          <div className="w-full lg:w-[400px]">
            <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">Đơn hàng của bạn</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                      <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                      <p className="text-sm font-bold text-[#FF6B6B]">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Tổng thanh toán</span>
                  <span className="text-2xl font-extrabold text-[#FF6B6B]">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-[#FF6B6B] text-white py-6 rounded-xl text-lg font-semibold shadow-lg transition-all"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng ngay'}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}