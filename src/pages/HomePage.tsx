import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { 
  Home, 
  Search, 
  MapPin, 
  ArrowRight, 
  Square, 
  Wind, 
  DoorOpen,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { listings, areas } from '../constants';
import { User as SupabaseUser } from '@supabase/supabase-js';

export const HomePage = ({ 
  onNavigate, 
  user, 
  onLogout 
}: { 
  onNavigate: (page: string) => void,
  user: SupabaseUser | null,
  onLogout: () => void
}) => {
  const [realListings, setRealListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [roomType, setRoomType] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const districts = ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ', 'Hòa Vang'];

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async (filters?: { location?: string, price?: string, type?: string }) => {
    setLoading(true);
    try {
      let query = supabase
        .from('listings')
        .select('*')
        .eq('is_active', true);

      if (filters?.location && filters.location !== '') {
        query = query.ilike('title', `%${filters.location}%`);
      }

      if (filters?.price && filters.price !== 'all') {
        if (filters.price === 'under2') query = query.lt('price', 2000000);
        else if (filters.price === '2to5') query = query.gte('price', 2000000).lte('price', 5000000);
        else if (filters.price === 'over5') query = query.gt('price', 5000000);
      }

      if (filters?.type && filters.type !== 'all') {
        query = query.ilike('title', `%${filters.type}%`);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setRealListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchListings({
      location: searchLocation,
      price: priceRange,
      type: roomType
    });
    
    // Scroll to listings section
    const listingsSection = document.getElementById('new-listings');
    if (listingsSection) {
      listingsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="text-primary">
                <Home className="w-8 h-8" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-primary font-display">Trọ Pro</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a className="text-sm font-semibold hover:text-primary transition-colors" href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Trang chủ</a>
              <a className="text-sm font-semibold hover:text-primary transition-colors" href="#" onClick={(e) => { e.preventDefault(); onNavigate('store'); }}>Cửa hàng</a>
              <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">Liên hệ</a>
              {user?.user_metadata?.role === 'landlord' && (
                <a 
                  href="#"
                  onClick={(e) => { e.preventDefault(); onNavigate('manage'); }}
                  className="text-sm font-semibold hover:text-primary transition-colors"
                >
                  Quản lý
                </a>
              )}
            </nav>
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

      <main>
        {/* Hero Section */}
        <section className="relative w-full h-[600px] flex items-center justify-center px-4 md:px-8 py-8">
          <div className="absolute inset-0 z-0 overflow-hidden rounded-[32px] mx-4 my-4 md:mx-8 md:my-8 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
            <img 
              alt="Hero Background" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1920"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="relative z-10 max-w-4xl w-full px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight font-display"
            >
              Tìm phòng trọ ưng ý cùng <span className="text-primary">Trọ Pro</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-200 mb-10 max-w-2xl mx-auto"
            >
              Hàng nghìn phòng trọ sạch đẹp, giá rẻ và đầy đủ tiện nghi đang chờ đón bạn.
            </motion.p>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-2 md:p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2"
            >
              {/* Location Selector */}
              <div 
                className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-slate-200 relative cursor-pointer group py-2"
                onClick={() => {
                  setShowSuggestions(!showSuggestions);
                  setShowPriceDropdown(false);
                  setShowTypeDropdown(false);
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mr-3 group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Địa điểm</p>
                  <p className="text-sm font-bold text-slate-700 truncate">
                    {searchLocation || 'Tất cả khu vực'}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showSuggestions ? '' : 'rotate-180'}`} />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 overflow-hidden"
                  >
                    <p className="px-5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">Khu vực Đà Nẵng</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchLocation('');
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-5 py-3 text-sm font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                      Tất cả khu vực
                    </button>
                    {districts.map((district) => (
                      <button
                        key={district}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchLocation(district);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-5 py-3 text-sm font-bold text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-3"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${searchLocation === district ? 'bg-primary' : 'bg-slate-300'}`}></div>
                        {district}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Price Selector */}
              <div 
                className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-slate-200 py-2 group relative cursor-pointer"
                onClick={() => {
                  setShowPriceDropdown(!showPriceDropdown);
                  setShowSuggestions(false);
                  setShowTypeDropdown(false);
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mr-3 group-hover:scale-110 transition-transform">
                  <Search className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Khoảng giá</p>
                  <p className="text-sm font-bold text-slate-700 truncate">
                    {priceRange === 'all' ? 'Tất cả mức giá' : 
                     priceRange === 'under2' ? 'Dưới 2 triệu' :
                     priceRange === '2to5' ? '2 - 5 triệu' : 'Trên 5 triệu'}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showPriceDropdown ? '' : 'rotate-180'}`} />

                {/* Price Dropdown */}
                {showPriceDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 overflow-hidden"
                  >
                    {[
                      { id: 'all', label: 'Tất cả mức giá' },
                      { id: 'under2', label: 'Dưới 2 triệu' },
                      { id: '2to5', label: '2 - 5 triệu' },
                      { id: 'over5', label: 'Trên 5 triệu' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPriceRange(item.id);
                          setShowPriceDropdown(false);
                        }}
                        className="w-full text-left px-5 py-3 text-sm font-bold text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-3"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${priceRange === item.id ? 'bg-primary' : 'bg-slate-300'}`}></div>
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Type Selector */}
              <div 
                className="flex-1 flex items-center px-4 py-2 group relative cursor-pointer"
                onClick={() => {
                  setShowTypeDropdown(!showTypeDropdown);
                  setShowSuggestions(false);
                  setShowPriceDropdown(false);
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mr-3 group-hover:scale-110 transition-transform">
                  <Home className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loại phòng</p>
                  <p className="text-sm font-bold text-slate-700 truncate">
                    {roomType === 'all' ? 'Tất cả loại' : roomType}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showTypeDropdown ? '' : 'rotate-180'}`} />

                {/* Type Dropdown */}
                {showTypeDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 overflow-hidden"
                  >
                    {[
                      { id: 'all', label: 'Tất cả loại' },
                      { id: 'Phòng trọ', label: 'Phòng trọ' },
                      { id: 'Căn hộ', label: 'Căn hộ mini' },
                      { id: 'Nhà nguyên căn', label: 'Nhà nguyên căn' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setRoomType(item.id);
                          setShowTypeDropdown(false);
                        }}
                        className="w-full text-left px-5 py-3 text-sm font-bold text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-3"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${roomType === item.id ? 'bg-primary' : 'bg-slate-300'}`}></div>
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <button 
                onClick={handleSearch}
                className="bg-primary text-white font-black uppercase tracking-widest text-xs px-10 py-4 rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-100 active:scale-95"
              >
                <Search className="w-4 h-4" />
                Tìm kiếm
              </button>
            </motion.div>
          </div>
        </section>

        {/* Featured Section */}
        <section id="new-listings" className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">Phòng trọ mới đăng</h2>
              <p className="text-slate-500 mt-1">Cập nhật những tin đăng mới nhất hàng ngày</p>
            </div>
            <a className="text-primary font-semibold flex items-center gap-1 hover:underline" href="#">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-slate-50 rounded-xl aspect-[4/3] animate-pulse"></div>
              ))
            ) : realListings.length > 0 ? (
              realListings.map((item) => (
                <motion.div 
                  key={item.id}
                  whileHover={{ y: -5 }}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      src={item.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'}
                      referrerPolicy="no-referrer"
                    />
                    {new Date(item.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                      <div className="absolute top-2 left-2 text-white text-[10px] font-black px-2 py-1 rounded bg-primary uppercase tracking-widest">MỚI</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-slate-900 line-clamp-1 font-display">{item.title}</h3>
                    <div className="flex items-center text-primary font-black my-2">
                      <span className="text-lg">{Number(item.price).toLocaleString()}đ</span>
                      <span className="text-xs font-bold text-slate-400 ml-1">/tháng</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <Square className="w-3 h-3" /> 
                        {item.area || '0'}m²
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> 
                        {item.location || 'Đà Nẵng'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-slate-400 font-bold">Chưa có bài đăng nào.</p>
              </div>
            )}
          </div>
        </section>

        {/* Popular Areas */}
        <section className="bg-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4 font-display">Khu vực nổi bật</h2>
              <p className="text-slate-500">Khám phá phòng trọ tại các quận huyện nhộn nhịp nhất</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {areas.map((area) => (
                <a key={area.name} className="relative h-64 rounded-xl overflow-hidden group cursor-pointer" href="#">
                  <img 
                    alt={area.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    src={area.image}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-lg font-bold font-display">{area.name}</p>
                    <p className="text-xs opacity-80">{area.count} tin đăng</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-primary">
                  <Home className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-primary font-display">Trọ Pro</h2>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Kênh thông tin tìm kiếm phòng trọ, căn hộ, nhà nguyên căn hàng đầu Việt Nam. Giúp bạn tìm được không gian sống lý tưởng một cách nhanh chóng và an toàn.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-6 font-display">Liên kết nhanh</h3>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="hover:text-primary transition-colors" href="#">Về chúng tôi</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Hướng dẫn đăng tin</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Bảng giá dịch vụ</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Liên hệ hỗ trợ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-6 font-display">Hỗ trợ khách hàng</h3>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="hover:text-primary transition-colors" href="#">Quy định đăng tin</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Chính sách bảo mật</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Giải quyết khiếu nại</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Câu hỏi thường gặp</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-6 font-display">Thông tin liên hệ</h3>
              <ul className="space-y-4 text-sm text-slate-500">
                <li className="flex items-start gap-3">
                  <MapPin className="text-primary w-5 h-5 flex-shrink-0" />
                  <span>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-primary w-5 h-5 flex-shrink-0" />
                  <span>(028) 1234 5678</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-primary w-5 h-5 flex-shrink-0" />
                  <span>support@phongtrovn.com</span>
                </li>
              </ul>
              <div className="flex gap-4 mt-6">
                <a className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm" href="#">
                  <Facebook className="w-4 h-4" />
                </a>
                <a className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm" href="#">
                  <Instagram className="w-4 h-4" />
                </a>
                <a className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm" href="#">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 text-center text-slate-500 text-xs">
            <p>© 2024 PhongTroVN. Tất cả các quyền được bảo hộ. Thiết kế bởi UI Designer.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
