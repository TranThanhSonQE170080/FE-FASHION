import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ✅ 1. Import các Contexts (Bộ nhớ dùng chung)
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';

// ✅ 2. Import các Trang (Pages)
import Index from './pages/Index';
import CartPage from './components/CartPage'; // Hoặc './pages/CartPage' tùy nơi bạn lưu
import CheckoutPage from './pages/CheckoutPage'; // ✅ IMPORT TRANG CHECKOUT VÀO ĐÂY
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import AuthCallback from './pages/AuthCallback';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// ✅ 3. Import Component bảo vệ Route
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* ✅ Bọc AuthProvider và CartProvider bao quanh ứng dụng */}
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Home & Shopping */}
              <Route path="/" element={<Index />} />
              <Route path="/cart" element={<CartPage />} />
              
              {/* ✅ KHAI BÁO ROUTE CHO TRANG CHECKOUT */}
              <Route path="/checkout" element={<CheckoutPage />} />
              
              <Route path="/products/:id" element={<ProductDetail />} />

              {/* ✅ Auth Routes (Đăng nhập / Đăng ký) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* ✅ Admin (Đã được bảo vệ bằng ProtectedAdminRoute) */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedAdminRoute>
                    <Admin />
                  </ProtectedAdminRoute>
                } 
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;