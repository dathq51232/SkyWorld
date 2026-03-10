-- Insert default categories (global, no user_id)
INSERT INTO public.categories (name, type, icon, color, is_default) VALUES
  -- Expense categories
  ('An uong', 'expense', 'utensils', '#ef4444', true),
  ('Di chuyen', 'expense', 'car', '#f97316', true),
  ('Mua sam', 'expense', 'shopping-bag', '#eab308', true),
  ('Hoa don', 'expense', 'file-text', '#84cc16', true),
  ('Giai tri', 'expense', 'gamepad-2', '#22c55e', true),
  ('Suc khoe', 'expense', 'heart-pulse', '#14b8a6', true),
  ('Giao duc', 'expense', 'graduation-cap', '#06b6d4', true),
  ('Khac', 'expense', 'more-horizontal', '#6b7280', true),
  -- Income categories
  ('Luong', 'income', 'briefcase', '#10b981', true),
  ('Thuong', 'income', 'gift', '#059669', true),
  ('Dau tu', 'income', 'trending-up', '#0d9488', true),
  ('Khac', 'income', 'plus-circle', '#6b7280', true)
ON CONFLICT DO NOTHING;
