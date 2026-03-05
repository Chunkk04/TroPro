import React from 'react';
import { 
  Home, 
  Search, 
  User, 
  LogIn, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Twitter,
  Menu,
  X,
  ArrowRight,
  Square,
  Wind,
  DoorOpen,
  ShieldCheck,
  Users,
  ShieldAlert,
  Send,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Smartphone,
  CheckCircle2
} from 'lucide-react';

export interface Listing {
  id: string;
  title: string;
  price: string;
  area: string;
  location: string;
  image: string;
  tags: string[];
  isHot?: boolean;
  isNew?: boolean;
}

export const listings: Listing[] = [
  {
    id: '1',
    title: 'Căn hộ studio Quận 1',
    price: '4.5 triệu',
    area: '30m²',
    location: 'Quận 1',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    tags: ['Ban công'],
    isNew: true
  },
  {
    id: '2',
    title: 'Phòng trọ khép kín Thủ Đức',
    price: '2.8 triệu',
    area: '20m²',
    location: 'Thủ Đức',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    tags: ['Gác lửng']
  },
  {
    id: '3',
    title: 'Nhà nguyên căn Bình Thạnh',
    price: '8 triệu',
    area: '60m²',
    location: 'Bình Thạnh',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800',
    tags: ['3 phòng'],
    isHot: true
  },
  {
    id: '4',
    title: 'Ký túc xá cao cấp Quận 7',
    price: '1.5 triệu',
    area: '15m²',
    location: 'Quận 7',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
    tags: ['Máy lạnh']
  }
];

export const areas = [
  { name: 'Hải Châu', count: '1,240', image: 'https://images.unsplash.com/photo-1559592413-7cee85affb4b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Thanh Khê', count: '850', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=800' },
  { name: 'Sơn Trà', count: '2,100', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&q=80&w=800' },
  { name: 'Ngũ Hành Sơn', count: '3,450', image: 'https://images.unsplash.com/photo-1583417267826-aebc4d1542a1?auto=format&fit=crop&q=80&w=800' },
  { name: 'Liên Chiểu', count: '1,800', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800' }
];
