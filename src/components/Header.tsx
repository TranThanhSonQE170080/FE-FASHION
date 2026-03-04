import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext'; 
import { useAuth } from '@/contexts/AuthContext'; 

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { cartCount } = useCart(); 
  
  const { user, isAdmin, logout } = useAuth(); 

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const categories = ['T-Shirts', 'Jeans', 'Jackets', 'Dresses', 'Hoodies', 'Sweaters'];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      {/* Top Bar */}
      <div className="bg-black text-white py-2 px-4 text-center text-sm">
        <p>Free shipping on orders over $100 | New arrivals weekly</p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-3xl font-bold tracking-tight">
              <span className="text-black group-hover:text-[#FF6B6B] transition-colors duration-300">FASHION</span>
              <span className="text-[#FF6B6B]">HUB</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-gray-800 hover:text-[#FF6B6B] font-medium transition-colors duration-200">
              Home
            </Link>
            <Link to="/" className="text-gray-800 hover:text-[#FF6B6B] font-medium transition-colors duration-200">
              New Arrivals
            </Link>
            <Link to="/" className="text-gray-800 hover:text-[#FF6B6B] font-medium transition-colors duration-200">
              Sale
            </Link>
            
            {/* ✅ Chỉ hiển thị link Admin khi người dùng đang đăng nhập VÀ có quyền admin */}
            {isAdmin && (
              <Link to="/admin" className="text-[#FF6B6B] hover:text-red-600 font-bold transition-colors duration-200 flex items-center gap-1">
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-[#FF6B6B] focus:ring-[#FF6B6B] rounded-full"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* ✅ KHU VỰC ĐĂNG NHẬP / THÔNG TIN USER */}
            {user ? (
              // Nếu đã đăng nhập: Hiện tên user và nút Đăng xuất
              <div className="hidden lg:flex items-center gap-3 border-r pr-4 border-gray-200">
                <span className="text-sm font-medium text-gray-600">
                  Hi, {user.email.split('@')[0]}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout} 
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full px-3"
                  title="Đăng xuất"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              // Nếu chưa đăng nhập: Hiện nút Đăng nhập & Đăng ký
              <div className="hidden lg:flex items-center gap-2 border-r pr-4 border-gray-200">
                <Link to="/login">
                  <Button variant="ghost" className="rounded-full font-medium hover:text-[#FF6B6B]">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="rounded-full bg-black text-white hover:bg-[#FF6B6B]">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-full ml-2">
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-gray-100 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Category Bar - Desktop */}
        <div className="hidden lg:flex items-center justify-center space-x-6 py-3 border-t border-gray-100">
          {categories.map((category) => (
            <button
              key={category}
              className="text-sm text-gray-600 hover:text-[#FF6B6B] font-medium transition-colors duration-200"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-full"
              />
            </form>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              
              {/* ✅ Menu Mobile: Chỉ hiện Admin khi là admin */}
              {isAdmin && (
                <Link to="/admin" className="px-4 py-2 text-[#FF6B6B] font-bold hover:bg-red-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</Link>
              )}

              {/* ✅ Menu Mobile: Nút Đăng nhập/Đăng xuất */}
              <div className="border-t pt-2 mt-2">
                {user ? (
                  <>
                    <p className="px-4 py-2 text-sm text-gray-500">Đang đăng nhập: {user.email}</p>
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">Đăng xuất</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Đăng nhập</Link>
                    <Link to="/register" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Đăng ký tài khoản</Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}