-- =====================================================================
--  معرض الراقي الهندسي للأثاث والديكور — مخطط قاعدة البيانات
--
--  طريقة التشغيل:
--    1. افتح مشروعك على https://supabase.com
--    2. من القائمة الجانبية: SQL Editor ← New query
--    3. الصق هذا الملف كاملاً واضغط Run
--
--  الملف آمن لإعادة التشغيل (idempotent) — يمكن تنفيذه أكثر من مرة.
--  الدليل الكامل بالعربية: docs/SETUP-AR.md
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) جدول المنتجات
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name        text not null,
  description text default '',
  price       numeric(14, 2) not null check (price >= 0),
  old_price   numeric(14, 2) check (old_price is null or old_price >= 0),
  category    text not null,
  images      jsonb not null default '[]'::jsonb,
  rating      smallint not null default 5 check (rating between 1 and 5),
  featured    boolean not null default false,
  published   boolean not null default true,
  in_stock    boolean not null default true,
  is_demo     boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists products_category_idx  on public.products (category);
create index if not exists products_published_idx on public.products (published);
create index if not exists products_created_idx   on public.products (created_at desc);

-- ---------------------------------------------------------------------
-- 2) جدول الإعدادات (صف واحد ثابت)
-- ---------------------------------------------------------------------
create table if not exists public.settings (
  id         integer primary key default 1,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint settings_single_row check (id = 1)
);

insert into public.settings (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- 3) تحديث updated_at تلقائياً
-- ---------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- 4) أمان مستوى الصف (RLS)
--
--    القاعدة: العملاء يقرأون المنتجات المنشورة فقط،
--             والكتابة والحذف للمدير المسجّل دخوله فقط.
--    هذه هي الحماية الحقيقية — حارس /admin في الواجهة تحسين
--    لتجربة الاستخدام فقط ولا يُعتمد عليه أمنياً.
-- ---------------------------------------------------------------------
alter table public.products enable row level security;
alter table public.settings enable row level security;

-- المنتجات: قراءة عامة للمنشور فقط
drop policy if exists "قراءة عامة للمنتجات المنشورة" on public.products;
create policy "قراءة عامة للمنتجات المنشورة"
  on public.products for select
  to anon, authenticated
  using (published = true or auth.role() = 'authenticated');

-- المنتجات: الكتابة للمدير المصادَق فقط
drop policy if exists "إضافة المنتجات للمدير" on public.products;
create policy "إضافة المنتجات للمدير"
  on public.products for insert
  to authenticated
  with check (true);

drop policy if exists "تعديل المنتجات للمدير" on public.products;
create policy "تعديل المنتجات للمدير"
  on public.products for update
  to authenticated
  using (true) with check (true);

drop policy if exists "حذف المنتجات للمدير" on public.products;
create policy "حذف المنتجات للمدير"
  on public.products for delete
  to authenticated
  using (true);

-- الإعدادات: قراءة عامة (رقم الواتساب والعنوان يظهران للعملاء)
drop policy if exists "قراءة عامة للإعدادات" on public.settings;
create policy "قراءة عامة للإعدادات"
  on public.settings for select
  to anon, authenticated
  using (true);

drop policy if exists "تعديل الإعدادات للمدير" on public.settings;
create policy "تعديل الإعدادات للمدير"
  on public.settings for all
  to authenticated
  using (true) with check (true);

-- ---------------------------------------------------------------------
-- 5) مخزن صور المنتجات
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "عرض صور المنتجات للجميع" on storage.objects;
create policy "عرض صور المنتجات للجميع"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "رفع صور المنتجات للمدير" on storage.objects;
create policy "رفع صور المنتجات للمدير"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "تعديل صور المنتجات للمدير" on storage.objects;
create policy "تعديل صور المنتجات للمدير"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

drop policy if exists "حذف صور المنتجات للمدير" on storage.objects;
create policy "حذف صور المنتجات للمدير"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- =====================================================================
--  انتهى. الخطوة التالية: أنشئ حساب المدير من
--  Authentication ← Users ← Add user (مع تفعيل Auto Confirm User)
-- =====================================================================
