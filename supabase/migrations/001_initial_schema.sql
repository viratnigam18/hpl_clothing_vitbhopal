-- ============================================================
-- HPL CLOTHING — Database Schema
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ====== TEAMS ======
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  color_hex text not null,
  crest_url text,
  sort_order int default 0
);

-- ====== PRODUCTS ======
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete set null,
  name text not null,
  slug text unique not null,
  type text check (type in ('jersey','hoodie','tee','cap')) not null,
  price int not null, -- in paise (₹499 = 49900)
  description text,
  is_bestseller boolean default false,
  is_new boolean default false,
  created_at timestamptz default now()
);

-- ====== PRODUCT IMAGES ======
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  url text not null,
  sort_order int default 0
);

-- ====== PRODUCT VARIANTS ======
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  size text not null,
  stock_qty int default 0
);

-- ====== ORDERS ======
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  buyer_name text not null,
  hostel_block text,
  room_no text,
  phone text not null,
  email text,
  status text default 'pending',
  razorpay_order_id text,
  razorpay_payment_id text,
  total_amount int not null,
  created_at timestamptz default now()
);

-- ====== ORDER ITEMS ======
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_variant_id uuid references product_variants(id),
  qty int not null,
  unit_price int not null
);

-- ====== DROPS ======
create table if not exists drops (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  ends_at timestamptz not null,
  is_active boolean default false
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table teams enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table drops enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Public read for catalog tables
create policy "Public read: teams" on teams for select using (true);
create policy "Public read: products" on products for select using (true);
create policy "Public read: product_images" on product_images for select using (true);
create policy "Public read: product_variants" on product_variants for select using (true);
create policy "Public read: drops" on drops for select using (true);

-- Orders: no direct client access (Edge Functions only, using service_role key)
-- No SELECT/INSERT/UPDATE/DELETE policies for anon on orders/order_items
-- Edge Functions bypass RLS with the service_role key

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_products_team_id on products(team_id);
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_type on products(type);
create index if not exists idx_product_images_product_id on product_images(product_id);
create index if not exists idx_product_variants_product_id on product_variants(product_id);
create index if not exists idx_orders_order_number on orders(order_number);
create index if not exists idx_drops_is_active on drops(is_active);
