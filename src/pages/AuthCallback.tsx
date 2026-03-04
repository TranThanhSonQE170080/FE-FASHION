import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
// Import authApi từ file auth.ts của bạn
import { authApi } from '@/lib/auth'; 

export default function AuthCallback() {
  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Thay 'client'.auth.login() thành authApi.login()
        await authApi.login(); 
        window.location.href = '/';
      } catch (error) {
        console.error('Auth error:', error);
        window.location.href = '/';
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Đang xác thực...</p>
      </div>
    </div>
  );
}