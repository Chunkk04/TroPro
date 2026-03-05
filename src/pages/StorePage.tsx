import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  Search, 
  User, 
  LogOut, 
  ShoppingCart, 
  Heart, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  LayoutGrid,
  Armchair,
  Utensils,
  Sparkles,
  Trash2,
  Bed
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface StorePageProps {
  onNavigate: (page: string) => void;
  user: SupabaseUser | null;
  onLogout: () => void;
}

export const StorePage = ({ onNavigate, user, onLogout }: StorePageProps) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Tất cả', icon: LayoutGrid },
    { id: 'furniture', label: 'Nội thất', icon: Armchair },
    { id: 'kitchen', label: 'Bếp & Đồ dùng', icon: Utensils },
    { id: 'decor', label: 'Trang trí', icon: Sparkles },
    { id: 'cleaning', label: 'Vệ sinh', icon: Trash2 },
    { id: 'bedroom', label: 'Phòng ngủ', icon: Bed },
  ];

  const products = [
    {
      id: 1,
      category: 'Nội thất',
      title: 'Bàn làm việc gỗ thông Minimal',
      price: '850.000đ',
      rating: 4.8,
      reviews: 120,
      image: 'https://images.unsplash.com/photo-1518455027359-f3f816b1a22a?auto=format&fit=crop&q=80&w=400',
      tag: 'furniture'
    },
    {
      id: 2,
      category: 'Dụng cụ bếp',
      title: 'Ấm đun siêu tốc Ceramic Pro',
      price: '320.000đ',
      oldPrice: '400.000đ',
      discount: 'Giảm 20%',
      rating: 4.5,
      reviews: 85,
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=400',
      tag: 'kitchen'
    },
    {
      id: 3,
      category: 'Trang trí',
      title: 'Đèn ngủ cảm ứng thân gỗ',
      price: '185.000đ',
      rating: 4.9,
      reviews: 210,
      image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=400',
      tag: 'decor'
    },
    {
      id: 4,
      category: 'Vệ sinh',
      title: 'Bộ vệ sinh đa năng 5 trong 1',
      price: '120.000đ',
      rating: 4.7,
      reviews: 56,
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
      tag: 'cleaning'
    },
    {
      id: 5,
      category: 'Phòng ngủ',
      title: 'Bộ ga giường Cotton êm ái',
      price: '450.000đ',
      rating: 4.6,
      reviews: 42,
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400',
      tag: 'bedroom'
    },
    {
      id: 6,
      category: 'Nội thất',
      title: 'Kệ sách treo tường tiết kiệm diện tích',
      price: '215.000đ',
      rating: 4.4,
      reviews: 31,
      image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=400',
      tag: 'furniture'
    }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.tag === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
                <div className="text-primary">
                  <Home className="w-8 h-8" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-primary font-display">Trọ Pro</h1>
              </div>
              <nav className="hidden md:flex items-center gap-8">
                <a className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors" href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Trang chủ</a>
                <a className="text-sm font-bold text-primary border-b-2 border-primary pb-1" href="#" onClick={(e) => { e.preventDefault(); onNavigate('store'); }}>Cửa hàng</a>
                <a className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors" href="#">Liên hệ</a>
                {user?.user_metadata?.role === 'landlord' && (
                  <a 
                    href="#"
                    onClick={(e) => { e.preventDefault(); onNavigate('manage'); }}
                    className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
                  >
                    Quản lý
                  </a>
                )}
              </nav>
            </div>

            <div className="flex-1 max-w-md mx-8 hidden lg:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all" 
                  placeholder="Tìm kiếm đồ dùng, nội thất..." 
                  type="text"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 max-w-[120px] truncate">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => onNavigate('login')}
                    className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-primary transition-colors"
                  >
                    Đăng nhập
                  </button>
                  <button 
                    onClick={() => onNavigate('register')}
                    className="bg-primary text-white text-sm font-bold px-5 py-2 rounded-lg hover:bg-primary-hover transition-all shadow-md"
                  >
                    Đăng ký
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col gap-10">
          {/* Hero Banner */}
          <section className="relative h-[300px] rounded-[32px] overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10"></div>
            <img 
              alt="Store Hero" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=1920"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-20 h-full flex flex-col justify-center px-12 text-white">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-block bg-primary text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg mb-6 w-max shadow-lg"
              >
                Bộ sưu tập 2024
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black mb-4 leading-tight font-display"
              >
                Cửa hàng tiện ích<br/>Dành cho ngôi nhà mới
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 max-w-md mb-8 text-sm font-medium"
              >
                Trang bị đầy đủ cho căn phòng trọ của bạn với chi phí tiết kiệm nhất.
              </motion.p>
              <div className="flex gap-4">
                <button className="bg-white text-slate-900 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl">
                  Mua sắm ngay
                </button>
                {/* Nút đăng bài - Ai cũng dùng được */}
                <button className="bg-primary text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-hover transition-all shadow-xl flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Đăng bài bán đồ
                </button>
              </div>
            </div>
          </section>

          {/* Category Navigation */}
          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border ${
                  activeCategory === cat.id 
                    ? 'bg-primary text-white border-primary shadow-orange-100' 
                    : 'bg-white text-slate-500 border-slate-100 hover:border-primary/50 hover:text-primary'
                }`}
              >
                <cat.icon className="w-5 h-5" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-[24px] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
              >
                <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
                  <img 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    src={product.image}
                    referrerPolicy="no-referrer"
                  />
                  {product.discount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg">
                      {product.discount}
                    </div>
                  )}
                  <button className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur rounded-xl text-slate-400 hover:text-primary transition-all shadow-lg hover:scale-110">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">{product.category}</p>
                  <h3 className="text-slate-900 font-black text-base mb-3 group-hover:text-primary transition-colors font-display line-clamp-2 min-h-[3rem]">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                      <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                      <span className="text-[10px] font-black text-orange-700">{product.rating}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">({product.reviews} đánh giá)</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xl font-black text-slate-900 font-display">{product.price}</span>
                      {product.oldPrice && (
                        <span className="block text-xs text-slate-400 line-through font-bold mt-1">{product.oldPrice}</span>
                      )}
                    </div>
                    <button className="w-12 h-12 bg-slate-900 text-white rounded-2xl hover:bg-primary transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center group-hover:scale-110">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 pt-12">
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 text-slate-400 hover:border-primary hover:text-primary transition-all hover:bg-slate-50">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary text-white font-black shadow-lg shadow-orange-100">1</button>
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-all hover:bg-slate-50 font-black">2</button>
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-all hover:bg-slate-50 font-black">3</button>
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 text-slate-400 hover:border-primary hover:text-primary transition-all hover:bg-slate-50">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-100 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-primary mb-6">
            <Home className="w-8 h-8" />
            <h2 className="text-slate-900 text-2xl font-black tracking-tight font-display">Trọ Pro</h2>
          </div>
          <p className="text-slate-500 font-bold text-sm mb-10 max-w-md mx-auto leading-relaxed">
            Giải pháp quản lý và trang trí nhà trọ chuyên nghiệp số 1 Việt Nam.
          </p>
          <div className="flex flex-wrap justify-center gap-10 text-xs font-black uppercase tracking-widest text-slate-400">
            <a className="hover:text-primary transition-colors" href="#">Về chúng tôi</a>
            <a className="hover:text-primary transition-colors" href="#">Chính sách bảo mật</a>
            <a className="hover:text-primary transition-colors" href="#">Điều khoản sử dụng</a>
            <a className="hover:text-primary transition-colors" href="#">Liên hệ</a>
          </div>
          <p className="text-slate-300 text-[10px] font-bold mt-12 uppercase tracking-[0.3em]">
            © 2024 Trọ Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
