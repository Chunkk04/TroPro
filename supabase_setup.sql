-- 1. Tạo bảng profiles để lưu thông tin bổ sung của người dùng
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  phone text,
  role text check (role in ('landlord', 'tenant')),
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Bật Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Tạo chính sách bảo mật (Policies)
-- Cho phép người dùng xem profile của chính mình
create policy "Users can view own profile" 
  on public.profiles for select 
  using ( auth.uid() = id );

-- Cho phép người dùng cập nhật profile của chính mình
create policy "Users can update own profile" 
  on public.profiles for update 
  using ( auth.uid() = id );

-- 4. Hàm tự động tạo profile khi có user mới đăng ký qua Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'role'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 5. Trigger chạy hàm handle_new_user sau khi insert vào auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
