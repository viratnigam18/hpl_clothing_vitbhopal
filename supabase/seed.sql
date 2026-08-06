-- ============================================================
-- HPL CLOTHING — Seed Data
-- ============================================================

-- ====== TEAMS ======
insert into teams (name, slug, color_hex, sort_order) values
  ('Kabini Lynx',       'kabini-lynx',       '#8E44AD', 1),
  ('Ken Cheetahs',      'ken-cheetahs',      '#E67E22', 2),
  ('Shimsha Panthers',  'shimsha-panthers',   '#2C3E50', 3),
  ('Tons Tigers',       'tons-tigers',        '#F39C12', 4),
  ('Orsang Leopards',   'orsang-leopards',    '#C0392B', 5),
  ('Arkavati Lions',    'arkavati-lions',     '#2980B9', 6),
  ('Harangi Jaguars',   'harangi-jaguars',    '#27AE60', 7);

-- ====== PRODUCTS (4 per team = 28 total) ======
-- We'll use a DO block to reference team IDs dynamically
do $$
declare
  t record;
  p_id uuid;
begin
  for t in select id, name, slug, color_hex from teams order by sort_order loop
    -- Jersey
    p_id := gen_random_uuid();
    insert into products (id, team_id, name, slug, type, price, description, is_bestseller, is_new)
    values (p_id, t.id, t.name || ' Jersey', t.slug || '-jersey', 'jersey', 149900,
      'Official HPL ' || t.name || ' jersey. Premium polyester, moisture-wicking, sublimation print.', true, false);
    insert into product_images (product_id, url, sort_order)
    values (p_id, 'https://placehold.co/600x800/' || substr(t.color_hex, 2) || '/ffffff?text=' || replace(t.name, ' ', '+') || '+Jersey', 0);
    insert into product_variants (product_id, size, stock_qty) values
      (p_id, 'S', 15), (p_id, 'M', 20), (p_id, 'L', 25), (p_id, 'XL', 10), (p_id, 'XXL', 0);

    -- Hoodie
    p_id := gen_random_uuid();
    insert into products (id, team_id, name, slug, type, price, description, is_bestseller, is_new)
    values (p_id, t.id, t.name || ' Hoodie', t.slug || '-hoodie', 'hoodie', 199900,
      'Official HPL ' || t.name || ' hoodie. Heavy cotton blend, kangaroo pocket, embroidered crest.', false, true);
    insert into product_images (product_id, url, sort_order)
    values (p_id, 'https://placehold.co/600x800/' || substr(t.color_hex, 2) || '/ffffff?text=' || replace(t.name, ' ', '+') || '+Hoodie', 0);
    insert into product_variants (product_id, size, stock_qty) values
      (p_id, 'S', 10), (p_id, 'M', 15), (p_id, 'L', 20), (p_id, 'XL', 8), (p_id, 'XXL', 0);

    -- Tee
    p_id := gen_random_uuid();
    insert into products (id, team_id, name, slug, type, price, description, is_bestseller, is_new)
    values (p_id, t.id, t.name || ' Tee', t.slug || '-tee', 'tee', 79900,
      'Official HPL ' || t.name || ' t-shirt. 100% cotton, screen print, relaxed fit.', false, false);
    insert into product_images (product_id, url, sort_order)
    values (p_id, 'https://placehold.co/600x800/' || substr(t.color_hex, 2) || '/ffffff?text=' || replace(t.name, ' ', '+') || '+Tee', 0);
    insert into product_variants (product_id, size, stock_qty) values
      (p_id, 'S', 20), (p_id, 'M', 25), (p_id, 'L', 30), (p_id, 'XL', 15), (p_id, 'XXL', 5);

    -- Cap
    p_id := gen_random_uuid();
    insert into products (id, team_id, name, slug, type, price, description, is_bestseller, is_new)
    values (p_id, t.id, t.name || ' Cap', t.slug || '-cap', 'cap', 49900,
      'Official HPL ' || t.name || ' cap. Structured cotton, embroidered logo, adjustable strap.', false, false);
    insert into product_images (product_id, url, sort_order)
    values (p_id, 'https://placehold.co/600x800/' || substr(t.color_hex, 2) || '/ffffff?text=' || replace(t.name, ' ', '+') || '+Cap', 0);
    insert into product_variants (product_id, size, stock_qty) values
      (p_id, 'S', 30), (p_id, 'M', 30), (p_id, 'L', 30), (p_id, 'XL', 30), (p_id, 'XXL', 30);
  end loop;
end $$;

-- ====== ACTIVE DROP ======
insert into drops (title, ends_at, is_active)
values ('Season 3 Drop', now() + interval '7 days', true);
