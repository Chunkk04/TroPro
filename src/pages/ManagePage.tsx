import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, 
  Home as HomeIcon, 
  FileText, 
  MessageSquare, 
  User, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Bed,
  Wallet,
  ChevronRight,
  LogOut,
  Home,
  Filter,
  ArrowUpDown,
  Maximize2,
  Users,
  MoreVertical,
  Construction,
  Info,
  Layers,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  ChevronLeft,
  Search,
  FileClock,
  Settings,
  Edit3,
  Phone,
  Video,
  PlusCircle,
  Image as ImageIcon,
  Smile,
  Send,
  MoreHorizontal,
  ShieldAlert,
  Ban,
  Mail,
  PhoneCall,
  MessageCircle,
  Shield,
  Lock,
  Camera,
  MapPin,
  Eye,
  EyeOff,
  BadgeCheck
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface ManagePageProps {
  onNavigate: (page: string) => void;
  user: SupabaseUser | null;
  onLogout: () => void;
}

export const ManagePage = ({ onNavigate, user, onLogout }: ManagePageProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [roomFilter, setRoomFilter] = useState('all');
  const [contractFilter, setContractFilter] = useState('all');
  const [activeChat, setActiveChat] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  // Real data states
  const [roomsData, setRoomsData] = useState<any[]>([]);
  const [contractsData, setContractsData] = useState<any[]>([]);
  const [invoicesData, setInvoicesData] = useState<any[]>([]);
  const [tenantsData, setTenantsData] = useState<any[]>([]);
  const [listingsData, setListingsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [
        { data: rooms },
        { data: contracts },
        { data: invoices },
        { data: tenants },
        { data: listings }
      ] = await Promise.all([
        supabase.from('rooms').select('*').eq('owner_id', user?.id),
        supabase.from('contracts').select('*, tenants(full_name), rooms(title)').eq('owner_id', user?.id),
        supabase.from('invoices').select('*, tenants(full_name), rooms(title)').eq('owner_id', user?.id),
        supabase.from('tenants').select('*').eq('owner_id', user?.id),
        supabase.from('listings').select('*').eq('owner_id', user?.id)
      ]);

      setRoomsData(rooms || []);
      setContractsData(contracts || []);
      setInvoicesData(invoices || []);
      setTenantsData(tenants || []);
      setListingsData(listings || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'rooms', label: 'Danh sách phòng', icon: HomeIcon },
    { id: 'tenants', label: 'Người thuê', icon: Users },
    { id: 'contracts', label: 'Hợp đồng', icon: FileText },
    { id: 'invoices', label: 'Hóa đơn', icon: Wallet },
    { id: 'listings', label: 'Bài đăng', icon: ImageIcon },
    { id: 'messages', label: 'Tin nhắn', icon: MessageSquare },
    { id: 'account', label: 'Tài khoản', icon: User },
  ];

  const stats = [
    { 
      label: 'Tổng số phòng', 
      value: roomsData.length.toString(), 
      change: '+0%', 
      trend: 'up', 
      icon: HomeIcon,
      color: 'bg-primary/10 text-primary',
      badge: 'bg-green-100 text-green-700'
    },
    { 
      label: 'Phòng đang trống', 
      value: roomsData.filter(r => r.status === 'empty').length.toString(), 
      change: `${roomsData.filter(r => r.status === 'empty').length} trống`, 
      trend: 'neutral', 
      icon: Bed,
      color: 'bg-orange-100 text-orange-600',
      badge: 'bg-orange-100 text-orange-700'
    },
    { 
      label: 'Doanh thu tháng này', 
      value: `${invoicesData.filter(inv => inv.status === 'paid').reduce((acc, inv) => acc + Number(inv.amount), 0).toLocaleString()}đ`, 
      change: '+0%', 
      trend: 'up', 
      icon: Wallet,
      color: 'bg-emerald-100 text-emerald-600',
      badge: 'bg-green-100 text-green-700'
    },
  ];

  const recentListings = listingsData.slice(0, 3).map(l => ({
    id: l.id,
    title: l.title,
    price: `${Number(l.price).toLocaleString()}đ`,
    status: l.is_active ? 'Đang hiển thị' : 'Tạm ẩn',
    statusColor: l.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600',
    image: l.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=200'
  }));

  const quickActions = [
    { label: 'Thêm phòng mới', icon: Plus },
    { label: 'Lập hợp đồng', icon: FileText },
    { label: 'Xuất hóa đơn', icon: Wallet },
    { label: 'Quản lý người ở', icon: User },
  ];

  const rooms = roomsData.map(r => ({
    id: r.id,
    title: r.title,
    price: `${Number(r.price).toLocaleString()}đ`,
    type: r.type || 'Phòng trọ',
    area: `${r.area} m²`,
    tenant: contractsData.find(c => c.room_id === r.id && c.status === 'active')?.tenants?.full_name || null,
    status: r.status,
    statusLabel: r.status === 'occupied' ? 'Đang thuê' : r.status === 'repairing' ? 'Đang sửa' : 'Trống',
    statusColor: r.status === 'occupied' ? 'bg-green-100 text-green-700 border-l-green-500' : r.status === 'repairing' ? 'bg-amber-100 text-amber-700 border-l-amber-500' : 'bg-orange-100 text-orange-700 border-l-orange-500',
    image: r.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400',
    note: r.note
  }));

  const filteredRooms = roomFilter === 'all' ? rooms : rooms.filter(r => r.status === roomFilter);

  const contracts = contractsData.map(c => ({
    id: c.id,
    tenant: c.tenants?.full_name || 'N/A',
    initials: (c.tenants?.full_name || 'NA').split(' ').map((n: any) => n[0]).join('').toUpperCase().slice(0, 2),
    room: c.rooms?.title || 'N/A',
    period: `${new Date(c.start_date).toLocaleDateString('vi-VN')} - ${new Date(c.end_date).toLocaleDateString('vi-VN')}`,
    deposit: `${Number(c.deposit).toLocaleString()}đ`,
    status: c.status,
    statusLabel: c.status === 'active' ? 'Đang hiệu lực' : c.status === 'expired' ? 'Đã hết hạn' : 'Đã chấm dứt',
    statusColor: c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
  }));

  const tenants = tenantsData.map(t => ({
    id: t.id,
    name: t.full_name,
    email: t.email,
    phone: t.phone,
    avatar: t.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.full_name)}&background=random`,
    room: contractsData.find(c => c.tenant_id === t.id && c.status === 'active')?.rooms?.title || 'Chưa thuê'
  }));

  const invoices = invoicesData.map(inv => ({
    id: inv.id,
    tenant: inv.tenants?.full_name || 'N/A',
    room: inv.rooms?.title || 'N/A',
    amount: `${Number(inv.amount).toLocaleString()}đ`,
    dueDate: new Date(inv.due_date).toLocaleDateString('vi-VN'),
    status: inv.status,
    statusLabel: inv.status === 'paid' ? 'Đã thanh toán' : inv.status === 'unpaid' ? 'Chưa thanh toán' : 'Quá hạn',
    statusColor: inv.status === 'paid' ? 'bg-green-100 text-green-700' : inv.status === 'unpaid' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
  }));

  const filteredContracts = contractFilter === 'all' ? contracts : contracts.filter(c => c.status === contractFilter);

  const conversations = [
    { 
      id: 1, 
      name: 'Nguyễn Văn A', 
      lastMessage: 'Chào bạn, dự án thế nào rồi?', 
      time: '10:30', 
      unread: 0, 
      online: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
    },
    { 
      id: 2, 
      name: 'Trần Thị B', 
      lastMessage: 'Bạn ơi, check giúp mình file này nhé', 
      time: '09:15', 
      unread: 2, 
      online: false,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
    },
    { 
      id: 3, 
      name: 'Nhóm Thiết Kế UI/UX', 
      lastMessage: 'Hoàng Nam: Đã cập nhật layout mới...', 
      time: 'Thứ 3', 
      unread: 0, 
      isGroup: true,
      avatar: null
    },
    { 
      id: 4, 
      name: 'Lê Văn C', 
      lastMessage: 'Hẹn gặp bạn vào cuối tuần này.', 
      time: '20 Thg 5', 
      unread: 0, 
      online: false,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
    },
  ];

  const messages = [
    { id: 1, text: 'Chào bạn! Mình đã xem qua bản thiết kế mới của bạn rồi.', time: '10:25 AM', isMe: false },
    { id: 2, text: 'Mọi thứ trông rất tuyệt, đặc biệt là cách phối màu của theme mới này.', time: '10:26 AM', isMe: false },
    { id: 3, text: 'Cảm ơn bạn nhiều! Mình cũng vừa mới hoàn thiện phần nhắn tin này xong.', time: '10:30 AM', isMe: true },
    { id: 4, text: 'Bạn thấy dự án này thế nào rồi? Chúng ta có thể bắt đầu code được chưa?', time: '10:30 AM', isMe: true },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
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
              <a className="text-sm font-bold text-primary transition-colors underline underline-offset-8" href="#" onClick={(e) => { e.preventDefault(); onNavigate('manage'); }}>Quản lý</a>
            </nav>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">{user?.user_metadata?.full_name || 'Người dùng'}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Chủ trọ VIP</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
                  <User className="text-slate-400 w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="p-6 flex-1">
            <div className="flex items-center gap-3 text-primary mb-8">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-display">Landlord CMS</h2>
            </div>
            
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                    activeTab === item.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-primary font-bold">
                  {user?.user_metadata?.full_name?.split(' ').pop()?.substring(0, 2).toUpperCase() || 'NT'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 truncate max-w-[120px]">
                    {user?.user_metadata?.full_name || 'Nguyễn Thành'}
                  </p>
                  <p className="text-xs text-slate-500">Chủ trọ VIP</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 flex flex-col ${activeTab === 'messages' ? '' : 'p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full'}`}>
          {activeTab === 'overview' && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">
                  Chào buổi sáng, {user?.user_metadata?.full_name?.split(' ').pop() || 'Thành'}!
                </h2>
                <p className="text-slate-500 font-medium">Dưới đây là thống kê tình hình kinh doanh của bạn hôm nay.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.badge}`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                    <h3 className="text-3xl font-black mt-1 text-slate-900 font-display">{stat.value}</h3>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart Mockup */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-bold text-slate-900 font-display">Doanh thu 6 tháng gần nhất</h3>
                    <select className="text-sm font-bold bg-slate-50 border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20">
                      <option>Năm 2024</option>
                      <option>Năm 2023</option>
                    </select>
                  </div>
                  
                  <div className="relative h-[300px] w-full flex items-end justify-between px-4">
                    {[40, 65, 85, 55, 95, 100].map((height, i) => (
                      <div key={i} className="flex flex-col items-center gap-4 w-12 md:w-16">
                        <div className="w-full bg-slate-50 rounded-t-2xl h-full relative overflow-hidden group">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="absolute bottom-0 left-0 right-0 bg-primary/20 rounded-t-2xl"
                          />
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${height * 0.7}%` }}
                            transition={{ duration: 1.2, delay: i * 0.1 }}
                            className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-2xl shadow-[0_-4px_10px_rgba(255,152,0,0.3)]"
                          />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 flex items-center justify-center">
                            <span className="bg-white text-primary text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                              {(height * 1.2).toFixed(1)}M
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-400">T{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Listings */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-slate-900 font-display">Tin đăng gần đây</h3>
                    <button className="text-primary text-sm font-bold hover:underline">Xem tất cả</button>
                  </div>
                  
                  <div className="space-y-6 flex-1">
                    {recentListings.map((listing) => (
                      <div key={listing.id} className="flex gap-4 group cursor-pointer">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                          <img 
                            src={listing.image} 
                            alt={listing.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{listing.title}</p>
                          <p className="text-xs font-bold text-primary mt-0.5">{listing.price}</p>
                          <span className={`inline-flex mt-2 items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${listing.statusColor}`}>
                            {listing.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="mt-8 w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-sm hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Tạo tin mới
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-10 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-8 font-display">Thao tác nhanh</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {quickActions.map((action, i) => (
                    <button 
                      key={i}
                      className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-slate-50 hover:bg-primary/10 hover:text-primary transition-all group border border-transparent hover:border-primary/20"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <action.icon className="w-7 h-7" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-primary">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'rooms' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Danh sách phòng</h2>
                  <p className="text-slate-500 font-medium">Quản lý và theo dõi trạng thái các phòng trọ của bạn.</p>
                </div>
                <button className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-100">
                  <Plus className="w-5 h-5" />
                  Thêm phòng mới
                </button>
              </div>

              {/* Filters & Stats */}
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
                  {[
                    { id: 'all', label: 'Tất cả', count: 24 },
                    { id: 'empty', label: 'Trống', count: 5 },
                    { id: 'occupied', label: 'Đang thuê', count: 16 },
                    { id: 'repairing', label: 'Đang sửa', count: 3 },
                  ].map((filter) => (
                    <button 
                      key={filter.id}
                      onClick={() => setRoomFilter(filter.id)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        roomFilter === filter.id 
                          ? 'bg-white shadow-sm text-primary' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {filter.label} ({filter.count})
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    <Filter className="w-4 h-4" />
                    Bộ lọc
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    <ArrowUpDown className="w-4 h-4" />
                    Sắp xếp
                  </button>
                </div>
              </div>

              {/* Rooms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredRooms.map((room) => (
                  <motion.div 
                    key={room.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all border-l-4 ${room.statusColor}`}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <div className="absolute top-3 right-3 z-10">
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${room.statusColor.split(' ').slice(0, 2).join(' ')}`}>
                          {room.statusLabel}
                        </span>
                      </div>
                      <img 
                        alt={room.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        src={room.image}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-black text-slate-900 font-display">{room.title}</h3>
                        <p className="text-primary font-black text-lg">{room.price}</p>
                      </div>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                          <Layers className="w-4 h-4 text-slate-400" />
                          <span>{room.type}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                          <Maximize2 className="w-4 h-4 text-slate-400" />
                          <span>{room.area}</span>
                        </div>
                        {room.tenant ? (
                          <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span>Khách: {room.tenant}</span>
                          </div>
                        ) : room.status === 'repairing' ? (
                          <div className="flex items-center gap-3 text-sm font-bold text-amber-600">
                            <Construction className="w-4 h-4" />
                            <span>{room.note}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-sm font-bold text-slate-400 italic">
                            <Info className="w-4 h-4" />
                            <span>Sẵn sàng đón khách</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                          room.status === 'empty' 
                            ? 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-orange-100' 
                            : 'bg-slate-100 text-slate-600 hover:bg-primary hover:text-white'
                        }`}>
                          {room.status === 'empty' ? 'Cho thuê ngay' : room.status === 'repairing' ? 'Cập nhật tiến độ' : 'Chi tiết'}
                        </button>
                        <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Add New Room Placeholder */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="group flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer min-h-[400px]"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all mb-6 shadow-sm">
                    <Plus className="w-8 h-8" />
                  </div>
                  <p className="font-black text-slate-600 group-hover:text-primary transition-all font-display">Thêm phòng mới</p>
                  <p className="text-xs font-bold text-slate-400 mt-2">Nhanh chóng mở rộng hệ thống</p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tenants' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Quản lý người thuê</h2>
                  <p className="text-slate-500 font-medium">Danh sách tất cả khách hàng đang thuê trọ của bạn.</p>
                </div>
                <button className="bg-primary text-white font-black uppercase tracking-widest text-xs py-4 px-8 rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Thêm người thuê
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tenants.map((tenant) => (
                  <div key={tenant.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-sm">
                        <img src={tenant.avatar} alt={tenant.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 font-display">{tenant.name}</h3>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest">{tenant.room}</p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                        <Mail className="w-4 h-4 text-slate-300" />
                        {tenant.email}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                        <Phone className="w-4 h-4 text-slate-300" />
                        {tenant.phone}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-3 rounded-xl bg-slate-50 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Hồ sơ</button>
                      <button className="flex-1 py-3 rounded-xl bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Nhắn tin</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'invoices' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Quản lý hóa đơn</h2>
                  <p className="text-slate-500 font-medium">Theo dõi tình trạng thanh toán tiền phòng và dịch vụ.</p>
                </div>
                <button className="bg-primary text-white font-black uppercase tracking-widest text-xs py-4 px-8 rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Lập hóa đơn mới
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách thuê</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phòng</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Số tiền</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hạn thanh toán</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-8 py-6">
                            <span className="font-black text-slate-900 font-display">{inv.tenant}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-xs font-bold text-slate-500">{inv.room}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="font-black text-slate-900">{inv.amount}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-xs font-bold text-slate-500">{inv.dueDate}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${inv.statusColor}`}>
                              {inv.statusLabel}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'listings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Quản lý bài đăng</h2>
                  <p className="text-slate-500 font-medium">Các tin đăng quảng bá phòng trọ của bạn trên hệ thống.</p>
                </div>
                <button className="bg-primary text-white font-black uppercase tracking-widest text-xs py-4 px-8 rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Tạo bài đăng mới
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listingsData.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={listing.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400'} 
                        alt={listing.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${listing.is_active ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'}`}>
                        {listing.is_active ? 'Đang hiển thị' : 'Tạm ẩn'}
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-lg font-black text-slate-900 font-display mb-2 group-hover:text-primary transition-colors">{listing.title}</h3>
                      <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2">{listing.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-primary font-display">{Number(listing.price).toLocaleString()}đ</span>
                        <div className="flex gap-2">
                          <button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-all">
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 transition-all">
                            <Ban className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'contracts' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Quản lý Hợp đồng</h2>
                  <p className="text-slate-500 font-medium">Xem và quản lý tất cả các hợp đồng thuê phòng của bạn.</p>
                </div>
                <button className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-100">
                  <Plus className="w-5 h-5" />
                  Tạo hợp đồng mới
                </button>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Đang hiệu lực', value: '24', sub: '+2 hợp đồng mới', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
                  { label: 'Chờ ký', value: '5', sub: 'Cần xử lý trong tuần', icon: FileClock, color: 'text-orange-600', bg: 'bg-orange-100' },
                  { label: 'Sắp hết hạn', value: '3', sub: 'Dưới 30 ngày', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</span>
                      <div className={`${stat.bg} ${stat.color} p-2 rounded-xl`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-display">{stat.value}</div>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Filters & Table Section */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-wrap items-center gap-4">
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Bộ lọc:</span>
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: 'Tất cả' },
                      { id: 'active', label: 'Đang hiệu lực' },
                      { id: 'pending', label: 'Chờ ký' },
                      { id: 'expired', label: 'Đã hết hạn' },
                    ].map((filter) => (
                      <button 
                        key={filter.id}
                        onClick={() => setContractFilter(filter.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                          contractFilter === filter.id 
                            ? 'bg-primary text-white shadow-md shadow-orange-100' 
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <button className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary transition-all">
                      <Filter className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary transition-all">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Khách thuê</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Phòng</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Thời gian</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Tiền cọc</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Trạng thái</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredContracts.map((contract) => (
                        <tr key={contract.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                                {contract.initials}
                              </div>
                              <div className="text-sm font-bold text-slate-900">{contract.tenant}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black text-slate-700 tracking-widest uppercase">
                              {contract.room}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-500">
                            {contract.period}
                          </td>
                          <td className="px-6 py-4 text-sm font-black text-slate-900">
                            {contract.deposit}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${contract.statusColor}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                contract.status === 'active' ? 'bg-green-500' : 
                                contract.status === 'pending' ? 'bg-primary' : 'bg-slate-400'
                              }`}></span>
                              {contract.statusLabel}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-slate-300 hover:text-primary transition-colors">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Hiển thị 1-{filteredContracts.length} trên tổng số 32 hợp đồng
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 border border-slate-200 rounded-xl text-slate-300 hover:bg-slate-50 disabled:opacity-50 transition-all" disabled>
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl font-black text-sm shadow-md shadow-orange-100">1</button>
                    <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-xl font-black text-sm transition-all">2</button>
                    <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-xl font-black text-sm transition-all">3</button>
                    <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]"
            >
              {/* Conversation List */}
              <aside className="w-full max-w-[360px] flex flex-col border-r border-slate-200 bg-white shrink-0">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-orange-100">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl font-black text-slate-900 font-display">Tin nhắn</h2>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-primary transition-all">
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-primary transition-all">
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                      placeholder="Tìm kiếm cuộc trò chuyện..." 
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex px-6 pt-2 gap-6 border-b border-slate-100 overflow-x-auto scrollbar-hide">
                  {['Tất cả', 'Chưa đọc', 'Nhóm', 'Lưu trữ'].map((tab, i) => (
                    <button 
                      key={tab}
                      className={`pb-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                        i === 0 ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto">
                  {conversations.map((conv) => (
                    <div 
                      key={conv.id}
                      onClick={() => setActiveChat(conv.id)}
                      className={`flex items-center gap-4 px-6 py-5 cursor-pointer transition-all border-l-4 ${
                        activeChat === conv.id 
                          ? 'bg-primary/5 border-primary' 
                          : 'border-transparent hover:bg-slate-50'
                      }`}
                    >
                      <div className="relative shrink-0">
                        {conv.avatar ? (
                          <img 
                            src={conv.avatar} 
                            alt={conv.name} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <Users className="w-6 h-6" />
                          </div>
                        )}
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className={`text-sm truncate font-display ${activeChat === conv.id ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                            {conv.name}
                          </h3>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{conv.time}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className={`text-xs truncate ${conv.unread > 0 ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                            {conv.lastMessage}
                          </p>
                          {conv.unread > 0 && (
                            <div className="min-w-[20px] h-5 bg-primary rounded-full flex items-center justify-center px-1.5 text-[10px] text-white font-black shadow-sm shadow-orange-100">
                              {conv.unread}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>

              {/* Chat Area */}
              <main className="flex-1 flex flex-col bg-white relative">
                {/* Chat Header */}
                <header className="h-20 flex items-center justify-between px-8 border-b border-slate-100 shrink-0 bg-white/80 backdrop-blur-md z-10">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {conversations.find(c => c.id === activeChat)?.avatar ? (
                        <img 
                          src={conversations.find(c => c.id === activeChat)?.avatar!} 
                          alt="Active Chat" 
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <Users className="w-6 h-6" />
                        </div>
                      )}
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900 font-display">
                        {conversations.find(c => c.id === activeChat)?.name}
                      </h2>
                      <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Đang hoạt động</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-all">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-all">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-all">
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 flex flex-col bg-slate-50/30">
                  <div className="flex justify-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white border border-slate-100 px-4 py-1.5 rounded-full shadow-sm">
                      Hôm nay
                    </span>
                  </div>

                  {messages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`flex items-end gap-3 max-w-[80%] ${msg.isMe ? 'self-end flex-row-reverse' : ''}`}
                    >
                      {!msg.isMe && (
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mb-1 border border-white shadow-sm">
                          <img 
                            src={conversations.find(c => c.id === activeChat)?.avatar!} 
                            alt="Sender" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`p-4 rounded-2xl text-sm font-medium shadow-sm ${
                          msg.isMe 
                            ? 'bg-primary text-white rounded-br-none shadow-orange-100' 
                            : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 mt-2 px-1 uppercase tracking-tighter">
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  <div className="flex items-end gap-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mb-1 border border-white shadow-sm">
                      <img 
                        src={conversations.find(c => c.id === activeChat)?.avatar!} 
                        alt="Sender" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="bg-white border border-slate-100 px-5 py-3 rounded-2xl rounded-bl-none flex gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></span>
                    </div>
                  </div>
                </div>

                {/* Input Bar */}
                <footer className="p-6 border-t border-slate-100 bg-white">
                  <div className="max-w-4xl mx-auto flex items-end gap-3 bg-slate-50 rounded-2xl p-3 pl-5 border border-slate-100">
                    <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl text-slate-400 hover:text-primary transition-all shrink-0 self-center">
                      <PlusCircle className="w-6 h-6" />
                    </button>
                    <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl text-slate-400 hover:text-primary transition-all shrink-0 self-center">
                      <ImageIcon className="w-6 h-6" />
                    </button>
                    <textarea 
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold py-2.5 resize-none max-h-32 placeholder:text-slate-400 outline-none" 
                      placeholder="Nhập tin nhắn..." 
                      rows={1}
                    ></textarea>
                    <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl text-slate-400 hover:text-primary transition-all shrink-0 self-center">
                      <Smile className="w-6 h-6" />
                    </button>
                    <button className="w-12 h-12 bg-primary text-white rounded-xl hover:bg-primary-hover transition-all shrink-0 flex items-center justify-center shadow-lg shadow-orange-100">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-[10px] font-bold text-center text-slate-400 mt-3 uppercase tracking-widest">
                    Nhấn Enter để gửi, Shift+Enter để xuống dòng
                  </p>
                </footer>
              </main>

              {/* Right Profile Sidebar */}
              <aside className="hidden xl:flex w-80 border-l border-slate-100 bg-white flex-col overflow-y-auto">
                <div className="p-10 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-3xl overflow-hidden ring-4 ring-slate-50 shadow-xl">
                      <img 
                        src={conversations.find(c => c.id === activeChat)?.avatar!} 
                        alt="Profile Large" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full shadow-lg"></div>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 font-display">
                    {conversations.find(c => c.id === activeChat)?.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Khách thuê phòng 101</p>
                  
                  <div className="flex gap-4 mt-8">
                    {[
                      { icon: User, label: 'Hồ sơ' },
                      { icon: MessageCircle, label: 'Tắt báo' },
                      { icon: Search, label: 'Tìm kiếm' },
                    ].map((btn, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <button className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20">
                          <btn.icon className="w-5 h-5" />
                        </button>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{btn.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-8 space-y-10 pb-10">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">Thông tin liên hệ</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <span className="truncate">vana@example.com</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                          <PhoneCall className="w-4 h-4" />
                        </div>
                        <span>+84 123 456 789</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">File đã gửi (12)</h4>
                      <button className="text-[10px] font-black text-primary uppercase hover:underline">Xem tất cả</button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200 group cursor-pointer">
                          <img 
                            src={`https://picsum.photos/seed/room${i}/200/200`} 
                            alt="Shared" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">Quyền riêng tư & Hỗ trợ</h4>
                    <div className="space-y-2">
                      <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-600 transition-all group">
                        <span>Chặn người dùng</span>
                        <Ban className="w-4 h-4 text-slate-300 group-hover:text-red-500 transition-colors" />
                      </button>
                      <button className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-xl text-sm font-bold text-red-500 transition-all group">
                        <span>Báo cáo vi phạm</span>
                        <ShieldAlert className="w-4 h-4 text-red-300 group-hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              </aside>
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto flex flex-col gap-8"
            >
              <div className="mb-2">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-display">Cài đặt tài khoản</h2>
                <p className="text-slate-500 font-medium">Quản lý thông tin cá nhân và thiết lập bảo mật của bạn.</p>
              </div>

              {/* Profile Header Card */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-slate-50 shadow-xl">
                    <img 
                      src={user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform border-4 border-white">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-center md:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <h3 className="text-2xl font-black text-slate-900 font-display">{user?.user_metadata?.full_name || 'Nguyễn Văn A'}</h3>
                    <span className="bg-orange-100 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3" />
                      Chủ trọ VIP
                    </span>
                  </div>
                  <p className="text-slate-500 font-bold text-sm mb-4">Chủ hệ thống trọ chuyên nghiệp • Tham gia từ 2023</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-2 rounded-xl">
                      <HomeIcon className="w-4 h-4" />
                      24 Phòng đang quản lý
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-2 rounded-xl">
                      <Users className="w-4 h-4" />
                      42 Người đang thuê
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Personal Info */}
                <div className="lg:col-span-2 space-y-8">
                  <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <h3 className="font-black text-slate-900 font-display flex items-center gap-3">
                        <User className="w-5 h-5 text-primary" />
                        Thông tin cá nhân
                      </h3>
                      <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline">Chỉnh sửa</button>
                    </div>
                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                          <input 
                            className="w-full rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" 
                            type="text" 
                            defaultValue={user?.user_metadata?.full_name || 'Nguyễn Văn A'}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email liên hệ</label>
                          <input 
                            className="w-full rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" 
                            type="email" 
                            defaultValue={user?.email || 'vana.nguyen@example.com'}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                          <input 
                            className="w-full rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 transition-all outline-none" 
                            type="tel" 
                            defaultValue={user?.user_metadata?.phone || '0901 234 567'}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Địa chỉ thường trú</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              className="w-full rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 pl-12 transition-all outline-none" 
                              type="text" 
                              defaultValue="123 Đường ABC, Quận 1, TP. HCM"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-8 flex justify-end">
                        <button className="bg-primary text-white font-black uppercase tracking-widest text-xs py-4 px-8 rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-orange-100">
                          Lưu thay đổi
                        </button>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Security & Settings */}
                <div className="space-y-8">
                  <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                      <h3 className="font-black text-slate-900 font-display flex items-center gap-3">
                        <Shield className="w-5 h-5 text-primary" />
                        Bảo mật
                      </h3>
                    </div>
                    <div className="p-8">
                      <form className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu cũ</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              className="w-full rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 pl-12 transition-all outline-none" 
                              placeholder="••••••••" 
                              type={showPassword ? 'text' : 'password'}
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              className="w-full rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 p-4 pl-12 transition-all outline-none" 
                              placeholder="Tối thiểu 8 ký tự" 
                              type={showPassword ? 'text' : 'password'}
                            />
                          </div>
                        </div>
                        <button className="w-full bg-slate-900 text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                          Cập nhật mật khẩu
                        </button>
                      </form>
                    </div>
                  </section>

                  {/* Danger Zone */}
                  <section className="bg-red-50 rounded-3xl border border-red-100 p-8">
                    <h4 className="text-red-600 font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" />
                      Vùng nguy hiểm
                    </h4>
                    <p className="text-xs font-bold text-red-400 mb-6 leading-relaxed">
                      Xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu phòng trọ, hợp đồng và tin nhắn của bạn. Hành động này không thể hoàn tác.
                    </p>
                    <button className="w-full py-3 rounded-xl border-2 border-red-200 text-red-600 font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                      Xóa tài khoản vĩnh viễn
                    </button>
                  </section>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab !== 'overview' && activeTab !== 'rooms' && activeTab !== 'contracts' && activeTab !== 'messages' && activeTab !== 'account' && activeTab !== 'tenants' && activeTab !== 'invoices' && activeTab !== 'listings' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                <Construction className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tính năng đang phát triển</h3>
              <p className="text-slate-500 max-w-xs">Chúng tôi đang nỗ lực hoàn thiện tính năng này. Vui lòng quay lại sau!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
